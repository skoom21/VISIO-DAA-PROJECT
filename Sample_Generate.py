import random
import os
import json

# Create a directory for storing the files
os.makedirs("data_files", exist_ok=True)

# Closest Pair of Points - Generate random points
def generate_random_points(num_points):
    return [(random.randint(0, 1000), random.randint(0, 1000)) for _ in range(num_points)]

# Integer Multiplication - Generate large integers
def generate_large_numbers(num_digits):
    num1 = random.randint(10**(num_digits-1), 10**num_digits - 1)
    num2 = random.randint(10**(num_digits-1), 10**num_digits - 1)
    return num1, num2

# Save data to files in JSON format
def save_to_file(filename, data):
    with open(filename, "w") as f:
        json.dump(data, f)

# Generate and save 10 random sample inputs for each problem
for i in range(10):
    # Closest Pair of Points
    points = generate_random_points(random.randint(100, 200))
    points_list = [[x, y] for x, y in points]
    save_to_file(f"data_files/closest_pair_points_{i+1}.txt", points_list)

    # Integer Multiplication
    num_digits = random.randint(50, 100)
    num1, num2 = generate_large_numbers(num_digits)
    save_to_file(f"data_files/integer_multiplication_{i+1}.txt", {"x": num1, "y": num2})

print("Data files generated successfully in 'data_files' directory.")
