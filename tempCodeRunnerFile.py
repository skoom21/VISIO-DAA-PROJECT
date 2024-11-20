import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from algorithms.closest_pair import closest_pair
from algorithms.multiplication import karatsuba

# Test imports
print(closest_pair)
print(karatsuba)
