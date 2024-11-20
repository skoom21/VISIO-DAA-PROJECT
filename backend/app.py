from unicodedata import digit
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import time
import math
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Define a Pydantic model for the request body
class ClosestPairRequest(BaseModel):
    points: list  # A list of points where each point is a list [x, y]

class KaratsubaRequest(BaseModel):
    x: int
    y: int

class KaratsubaResponse(BaseModel):
    result: int
    visualization_data: dict
    computation_time: float
    stats: dict


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend origin
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

class KaratsubaRequest(BaseModel):
    x: str  # Accept as string to handle large numbers
    y: str  # Accept as string to handle large numbers

class KaratsubaResponse(BaseModel):
    result: int
    visualization_data: dict
    computation_time: float
    stats: dict

@app.post("/karatsuba", response_model=KaratsubaResponse)
async def karatsuba_endpoint(data: KaratsubaRequest):
    # Parse the input strings into integers
    try:
        x = int(float(data.x))
        y = int(float(data.y))
    except ValueError:
        raise HTTPException(status_code=400, detail="Inputs must be valid integers as strings")

    # Track the visualization data
    visualization_data = {
        "steps": [],
        "multiplications": [],
        "recursions": []
    }

    # Define the Karatsuba algorithm with visualization tracking
    def karatsuba(x, y, depth=0):
        nonlocal visualization_data
        
        if x < 10 or y < 10:
            result = x * y
            visualization_data["steps"].append({
                "step": f"Base case: {x} * {y}",
                "result": result,
                "depth": depth
            })
            return result
        
        # Compute number of digits in the numbers
        n = max(len(str(x)), len(str(y)))
        half = n // 2

        # Split numbers into parts
        a, b = divmod(x, 10**half)
        c, d = divmod(y, 10**half)

        # Recursive calls for Karatsuba
        ac = karatsuba(a, c, depth+1)
        bd = karatsuba(b, d, depth+1)
        ad_plus_bc = karatsuba(a + b, c + d, depth+1) - ac - bd

        # Store intermediate multiplication results
        visualization_data["multiplications"].append({
            "ac": ac,
            "bd": bd,
            "ad_plus_bc": ad_plus_bc,
            "depth": depth
        })
        
        # Store recursion steps for visualization
        visualization_data["recursions"].append({
            "a": a, "b": b, "c": c, "d": d,
            "ac": ac, "bd": bd, "ad_plus_bc": ad_plus_bc,
            "result": ac * 10**(2 * half) + ad_plus_bc * 10**half + bd,
            "depth": depth
        })

        # Final result computation
        result = ac * 10**(2 * half) + ad_plus_bc * 10**half + bd
        visualization_data["steps"].append({
            "step": f"Combine results: ac * 10^(2n) + ad_plus_bc * 10^n + bd = {result}",
            "result": result,
            "depth": depth
        })

        return result

    # Start tracking time
    start_time = time.time()

    # Call the Karatsuba function
    result = karatsuba(x, y)

    # Calculate computation time
    computation_time = time.time() - start_time

    # Prepare the response with stats
    stats = {
        "total_steps": len(visualization_data["steps"]),
        "total_multiplications": len(visualization_data["multiplications"]),
        "total_recursions": len(visualization_data["recursions"]),
    }

    # Return the response with result and visualization data
    return {
        "result": result,
        "visualization_data": visualization_data,
        "computation_time": computation_time,
        "stats": stats
    }
    
@app.post("/closest-pair")
async def closest_pair_endpoint(data: ClosestPairRequest):
    points = data.points
    if not isinstance(points, list) or not all(len(p) == 2 and isinstance(p[0], (int, float)) and isinstance(p[1], (int, float)) for p in points):
        raise HTTPException(status_code=400, detail="Invalid points data")
    
    # Performance analysis: start time
    start_time = time.time()

    def distance(p1, p2):
        return math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)

    def closest_pair_recursive(pts_sorted_x, pts_sorted_y, level=0):
        n = len(pts_sorted_x)
        steps = []  # List to store the steps for visualization
        
        if n <= 3:
            min_dist = float('inf')
            pair = None
            for i in range(n):
                for j in range(i + 1, n):
                    d = distance(pts_sorted_x[i], pts_sorted_x[j])
                    if d < min_dist:
                        min_dist = d
                        pair = (pts_sorted_x[i], pts_sorted_x[j])
                    # Add visualization step
                    steps.append({
                        "step": f"Level {level}: Compare points {pts_sorted_x[i]} and {pts_sorted_x[j]} with distance {d}",
                        "current_point": pts_sorted_x[i],
                        "comparison_point": pts_sorted_x[j],
                        "line": [pts_sorted_x[i], pts_sorted_x[j]],  # Line between points being compared
                        "zone_of_interest": None  # No zone of interest at this step
                    })
            return pair, min_dist, steps

        mid = n // 2
        mid_point = pts_sorted_x[mid]

        left_x = pts_sorted_x[:mid]
        right_x = pts_sorted_x[mid:]
        left_y = list(filter(lambda p: p[0] <= mid_point[0], pts_sorted_y))
        right_y = list(filter(lambda p: p[0] > mid_point[0], pts_sorted_y))

        (left_pair, left_dist, left_steps) = closest_pair_recursive(left_x, left_y, level + 1)
        (right_pair, right_dist, right_steps) = closest_pair_recursive(right_x, right_y, level + 1)

        min_dist = min(left_dist, right_dist)
        pair = left_pair if left_dist < right_dist else right_pair

        strip = [p for p in pts_sorted_y if abs(p[0] - mid_point[0]) < min_dist]
        for i in range(len(strip)):
            for j in range(i + 1, min(i + 7, len(strip))):
                d = distance(strip[i], strip[j])
                if d < min_dist:
                    min_dist = d
                    pair = (strip[i], strip[j])
                # Add visualization step
                steps.append({
                    "step": f"Level {level}: Compare points {strip[i]} and {strip[j]} with distance {d}",
                    "current_point": strip[i],
                    "comparison_point": strip[j],
                    "line": [strip[i], strip[j]],  # Line between points being compared
                    "zone_of_interest": [mid_point, strip[i], strip[j]]  # Zone of interest
                })

        # Merge steps from both halves
        steps.extend(left_steps)
        steps.extend(right_steps)
        return pair, min_dist, steps

    # Sort the points by x and y coordinates
    points.sort(key=lambda x: x[0])
    points_y = sorted(points, key=lambda x: x[1])

    # Call the recursive closest pair function
    pair, min_dist, steps = closest_pair_recursive(points, points_y)

    # Performance analysis: execution time
    execution_time = time.time() - start_time

    # Return the result along with visualization and performance analysis
    return {
        "closest_pair": pair,
        "distance": min_dist,
        "visualization": {
            "steps": steps,  # List of steps showing the comparison between points and zones
        },
        "analysis": {
            "execution_time": execution_time,  # Time taken for computation
            "num_recursive_calls": len(steps),  # Number of recursive calls made
            "input_values": {"points": points},
        }
    }