import pandas as pd
import numpy as np
import random
import json
from collections import deque
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, InputLayer
from tensorflow.keras.optimizers import Adam

# Environment
class RouteEnv:
    def __init__(self, donor_coord, recipient_coords):
        self.donor = donor_coord
        self.recipients = recipient_coords
        self.num_recipients = len(recipient_coords)
        self.reset()

    def reset(self):
        self.visited = set()
        self.current_pos = self.donor
        self.total_distance = 0.0
        return self._get_state()

    def _get_state(self):
        visited_mask = [1 if i in self.visited else 0 for i in range(self.num_recipients)]
        flat_recipients = [coord for point in self.recipients for coord in point]
        return np.array([*self.current_pos, *flat_recipients, *visited_mask], dtype=np.float32)

    def step(self, action):
        if action in self.visited:
            return self._get_state(), -10.0, False, {}

        next_pos = self.recipients[action]
        distance = np.linalg.norm(np.array(self.current_pos) - np.array(next_pos))
        self.total_distance += distance
        self.visited.add(action)
        self.current_pos = next_pos

        reward = -distance
        done = len(self.visited) == self.num_recipients
        return self._get_state(), reward, done, {}

# DQN Agent
class DQNAgent:
    def __init__(self, state_size, action_size):
        self.learning_rate = 0.001
        self.model = self._build_model(state_size, action_size)
        self.target_model = self._build_model(state_size, action_size)
        self.update_target_model()
        self.memory = deque(maxlen=2000)
        self.gamma = 0.95
        self.epsilon = 1.0
        self.epsilon_decay = 0.995
        self.epsilon_min = 0.01

    def _build_model(self, input_dim, output_dim):
        model = Sequential()
        model.add(InputLayer(input_shape=(input_dim,)))
        model.add(Dense(128, activation="relu"))
        model.add(Dense(128, activation="relu"))
        model.add(Dense(output_dim, activation="linear"))
        model.compile(loss="mse", optimizer=Adam(learning_rate=self.learning_rate))
        return model

    def update_target_model(self):
        self.target_model.set_weights(self.model.get_weights())

    def act(self, state, available_actions):
        if np.random.rand() <= self.epsilon:
            return random.choice(available_actions)
        q_values = self.model.predict(np.expand_dims(state, axis=0), verbose=0)[0]
        filtered_qs = [(i, q_values[i]) for i in available_actions]
        return max(filtered_qs, key=lambda x: x[1])[0]

    def remember(self, state, action, reward, next_state, done):
        self.memory.append((state, action, reward, next_state, done))

    def replay(self, batch_size):
        minibatch = random.sample(self.memory, min(batch_size, len(self.memory)))
        for state, action, reward, next_state, done in minibatch:
            target = self.model.predict(np.expand_dims(state, axis=0), verbose=0)[0]
            if done:
                target[action] = reward
            else:
                t = self.target_model.predict(np.expand_dims(next_state, axis=0), verbose=0)[0]
                target[action] = reward + self.gamma * np.amax(t)
            self.model.fit(np.expand_dims(state, axis=0), np.expand_dims(target, axis=0), verbose=0)

# ⛔ Prevent training from running when imported
if __name__ == "__main__":
    # Load your combined CSV
    df = pd.read_csv("synthetic_routing_data.csv")

    # Pick a donor
    donor_id = df["donor_id"].iloc[0]
    donor_row = df[df["donor_id"] == donor_id].iloc[0]
    donor_coord = (donor_row["lat_donor"], donor_row["lng_donor"])

    # Get all recipients for that donor
    recipient_coords = df[df["donor_id"] == donor_id][["lat_recipient", "lng_recipient"]].values.tolist()

    # Train
    env = RouteEnv(donor_coord, recipient_coords)
    state_size = len(env.reset())
    action_size = env.num_recipients
    agent = DQNAgent(state_size, action_size)

    episodes = 100
    batch_size = 32

    for e in range(episodes):
        state = env.reset()
        done = False
        while not done:
            available_actions = [i for i in range(env.num_recipients) if i not in env.visited]
            action = agent.act(state, available_actions)
            next_state, reward, done, _ = env.step(action)
            agent.remember(state, action, reward, next_state, done)
            state = next_state
        agent.replay(batch_size)
        agent.update_target_model()
        if agent.epsilon > agent.epsilon_min:
            agent.epsilon *= agent.epsilon_decay
        print(f"Episode {e+1}/{episodes} - Epsilon: {agent.epsilon:.4f}")

    # Save trained model
    agent.model.save("dqn_route_optimizer_model.h5")
    print("✅ Model saved: dqn_route_optimizer_model.h5")

    # Generate and print optimized route
    env.reset()
    done = False
    final_route = [env.donor]
    while not done:
        available_actions = [i for i in range(env.num_recipients) if i not in env.visited]
        action = agent.act(env._get_state(), available_actions)
        _, _, done, _ = env.step(action)
        final_route.append(env.current_pos)

    print("\n✅ Optimized Route:")
    for lat, lng in final_route:
        print(f"{lat:.6f}, {lng:.6f}")






