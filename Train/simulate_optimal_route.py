import pickle

# === Load the trained Q-table ===
with open("models/q_table.pkl", "rb") as f:
    q_table = pickle.load(f)

# === Define the grid and goal ===
GRID_SIZE = 5
goal_state = (4, 4)
actions = ['up', 'down', 'left', 'right']

# === Movement logic (same as training) ===
def get_next_state(state, action):
    x, y = state
    if action == 'up':
        return (max(x - 1, 0), y)
    elif action == 'down':
        return (min(x + 1, GRID_SIZE - 1), y)
    elif action == 'left':
        return (x, max(y - 1, 0))
    elif action == 'right':
        return (x, min(y + 1, GRID_SIZE - 1))
    return state

# === Path simulation ===
def simulate_route(start_state):
    state = start_state
    path = [state]

    while state != goal_state:
        if state not in q_table:
            print(f"No Q-values for state {state}, stopping.")
            break

        # Pick action with highest Q-value
        action = max(q_table[state], key=q_table[state].get)
        state = get_next_state(state, action)

        if state in path:
            print("⚠️ Detected loop — breaking.")
            break

        path.append(state)

    return path

# === Run it ===
start = (0, 0)  # 🟢 Starting location
optimal_path = simulate_route(start)

# === Display result ===
print("\n🚚 Optimal Route from", start, "to", goal_state)
for step in optimal_path:
    print(" →", step)
