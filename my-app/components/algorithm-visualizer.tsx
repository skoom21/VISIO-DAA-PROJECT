"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import Loader  from "@/components/ui/loader";
import ReactFlow, { Node, Edge } from "reactflow";
import "reactflow/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  SkipBack,
  SkipForward,
} from "lucide-react";
import Image from "next/image";

// Karatsuba Algorithm Visualization
const KaratsubaVisualization = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [input1, setInput1] = useState("1234");
  const [input2, setInput2] = useState("5678");
  const [result, setResult] = useState<string | null>(null);
  const [timeTaken, setTimeTaken] = useState<number | null>(null);
  const [recursiveCalls, setRecursiveCalls] = useState<number>(0);
  const [showDetails, setShowDetails] = useState(false);

  const karatsuba = useCallback(
    (x: string, y: string, depth = 0, id = "0"): [Node[], string] => {
      setRecursiveCalls((prev) => prev + 1);
      const n = Math.max(x.length, y.length);
      if (n <= 4) {
        const result = (BigInt(parseInt(x)) * BigInt(parseInt(y))).toString();
        return [
          [
            {
              id,
              data: { label: `${x} * ${y} = ${result}` },
              position: { x: 0, y: depth * 100 },
            },
          ],
          result,
        ];
      }

      const m = Math.floor(n / 2);
      const x1 = x.slice(0, -m) || "0";
      const x0 = x.slice(-m);
      const y1 = y.slice(0, -m) || "0";
      const y0 = y.slice(-m);

      const [nodes1, z2] = karatsuba(x1, y1, depth + 1, `${id}-0`);
      const [nodes0, z0] = karatsuba(x0, y0, depth + 1, `${id}-1`);
      const [nodesMid, z1] = karatsuba(
        (BigInt(parseInt(x1)) + BigInt(parseInt(x0))).toString(),
        (BigInt(parseInt(y1)) + BigInt(parseInt(y0))).toString(),
        depth + 1,
        `${id}-2`
      );

      const result = (
        BigInt(z2) * BigInt(10) ** BigInt(2 * m) +
        (BigInt(z1) - BigInt(z2) - BigInt(z0)) * BigInt(10) ** BigInt(m) +
        BigInt(z0)
      ).toString();

      const nodes: Node[] = [
        {
          id,
          data: { label: `${x} * ${y} = ${result}` },
          position: { x: 0, y: depth * 100 },
        },
        ...nodes1.map((node, index) => ({
          ...node,
          position: {
            x: index * 200 - (nodes1.length - 1) * 100,
            y: (depth + 1) * 100,
          },
        })),
        ...nodes0.map((node, index) => ({
          ...node,
          position: {
            x: index * 200 - (nodes0.length - 1) * 100,
            y: (depth + 1) * 100,
          },
        })),
        ...nodesMid.map((node, index) => ({
          ...node,
          position: {
            x: index * 200 - (nodesMid.length - 1) * 100,
            y: (depth + 1) * 100,
          },
        })),
      ];

      return [nodes, result];
    },
    []
  );

  const generateEdges = useCallback((nodes: Node[]): Edge[] => {
    return nodes.flatMap((node) =>
      node.id.includes("-")
        ? [
            {
              id: `e${node.id}`,
              source: node.id.split("-").slice(0, -1).join("-"),
              target: node.id,
              animated: true,
            },
          ]
        : []
    );
  }, []);

  const handleVisualize = useCallback(() => {
    setRecursiveCalls(0);
    const startTime = performance.now();
    const [newNodes, result] = karatsuba(input1, input2);
    const endTime = performance.now();
    setNodes(newNodes);
    setEdges(generateEdges(newNodes));
    setResult(result);
    setTimeTaken(endTime - startTime);
  }, [input1, input2, karatsuba, generateEdges]);

  const validateFile = (file: File) => {
    if (!file.name.startsWith("integer_multiplication")) {
      alert("Invalid file name. The file name should start with 'integer_multiplication'.");
      return false;
    }
    return true;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && validateFile(file)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        try {
          const data = JSON.parse(content);
          if (typeof data.x === "number" && typeof data.y === "number") {
            setInput1(data.x.toString());
            setInput2(data.y.toString());
          } else {
            alert("Invalid file content. The data inside the file should be numbers.");
          }
        } catch {
          alert("Error parsing file. Please ensure the file is a valid JSON.");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="w-full p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-2">Karatsuba Algorithm Visualization</h2>
      <p className="text-muted-foreground mb-4">
      Visualize the recursive calls in the Karatsuba multiplication algorithm
      </p>
      <div className="flex space-x-4 mb-4">
      <div className="flex-1">
        <Label htmlFor="input1">Number 1</Label>
        <Input
        id="input1"
        value={input1}
        onChange={(e) => setInput1(e.target.value)}
        />
      </div>
      <div className="flex-1">
        <Label htmlFor="input2">Number 2</Label>
        <Input
        id="input2"
        value={input2}
        onChange={(e) => setInput2(e.target.value)}
        />
      </div>
      <Button onClick={handleVisualize} className="mt-6">
        Visualize
      </Button>
      </div>
      <div className="mb-4">
      <Label htmlFor="file-upload">Upload Data File</Label>
      <Input
        id="file-upload"
        type="file"
        onChange={handleFileUpload}
        accept=".txt,application/json"
      />
      </div>
      <div style={{ height: "500px" }}>
      <ReactFlow
        nodes={nodes.map((node, index) => ({
        ...node,
        position: { x: index * 200, y: Math.floor(index / 2) * 100 },
        }))}
        edges={edges}
        fitView
      />
      </div>
      <div className="mt-4">
      <Button
        onClick={() => setShowDetails(!showDetails)}
        variant="outline"
        className="w-full flex justify-between items-center"
      >
        Details
        {showDetails ? (
        <ChevronUp className="h-4 w-4" />
        ) : (
        <ChevronDown className="h-4 w-4" />
        )}
      </Button>
      <AnimatePresence>
        {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-muted p-4 rounded-md mt-2"
        >
          <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          >
          <strong>Result:</strong> {result}
          </motion.p>
          <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          >
          <strong>Time taken:</strong> {timeTaken?.toFixed(2)} ms
          </motion.p>
          <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          >
          <strong>Recursive calls:</strong> {recursiveCalls}
          </motion.p>
          <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          >
          <strong>Time complexity:</strong> O(n^log₂3) ≈ O(n^1.585)
          </motion.p>
          <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          >
          <strong>Space complexity:</strong> O(log n)
          </motion.p>
        </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};

// Closest Pair of Points Visualization
interface Point {
  x: number;
  y: number;
}

interface AlgorithmState {
  frontierPoint: Point | null;
  candidate: Point | null;
  d: number;
  frontier: Point[];
  closestPair: Point[] | null;
}

const ClosestPairVisualizer: React.FC = () => {
  const [points, setPoints] = useState<Point[]>([]);
  const [states, setStates] = useState<AlgorithmState[]>([]);
  const [currentStateIndex, setCurrentStateIndex] = useState(0);
  const [numPoints, setNumPoints] = useState(13);
  const [showFileUploadHelp, setShowFileUploadHelp] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [comparisons, setComparisons] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const distance = (p1: Point, p2: Point) =>
    Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));

  const closestPairAlgorithm = useCallback(
    (points: Point[]): AlgorithmState[] => {
      const states: AlgorithmState[] = [];
      const sortedPoints = points.sort((a, b) => a.x - b.x);
      let closestPair: Point[] = [sortedPoints[0], sortedPoints[1]];
      let minDistance = distance(closestPair[0], closestPair[1]);
      let frontier: Point[] = [sortedPoints[0], sortedPoints[1]];

      const addState = (
        frontierPoint: Point | null,
        candidate: Point | null
      ) => {
        states.push({
          frontierPoint,
          candidate,
          d: minDistance,
          frontier: [...frontier],
          closestPair: closestPair ? [...closestPair] : null,
        });
      };

      addState(null, null);

      for (let i = 2; i < sortedPoints.length; i++) {
        const currentPoint = sortedPoints[i];
        addState(currentPoint, null);

        // Remove points from frontier that are too far to the left
        frontier = frontier.filter((p) => currentPoint.x - p.x <= minDistance);

        // Check distance to points in frontier
        for (const frontierPoint of frontier) {
          addState(currentPoint, frontierPoint);
          setComparisons((prev) => prev + 1);
          const dist = distance(currentPoint, frontierPoint);
          addState(currentPoint, frontierPoint);
          if (dist < minDistance) {
            minDistance = dist;
            closestPair = [frontierPoint, currentPoint];
            addState(currentPoint, frontierPoint);
          }
        }

        frontier.push(currentPoint);
      }

      return states;
    },
    []
  );

  const generatePoints = useCallback(() => {
    const newPoints: Point[] = [];
    for (let i = 0; i < numPoints; i++) {
      newPoints.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
      });
    }
    setPoints(newPoints);
    setStates(closestPairAlgorithm(newPoints));
    setCurrentStateIndex(0);
  }, [numPoints, closestPairAlgorithm]);

  const clearPoints = () => {
    setPoints([]);
    setStates([]);
    setCurrentStateIndex(0);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        try {
          const data = JSON.parse(content);
          if (
            Array.isArray(data) &&
            data.every(
              (point) =>
                Array.isArray(point) &&
                point.length === 2 &&
                point.every((coord) => typeof coord === "number")
            )
          ) {
            const parsedPoints = data.map(([x, y]: [number, number]) => ({
              x,
              y,
            }));
            setPoints(parsedPoints);
            setStates(closestPairAlgorithm(parsedPoints));
            setCurrentStateIndex(0);
          } else {
            console.error("Invalid file content:", data);
            alert("Invalid file content. Please upload a valid JSON file with an array of [x, y] coordinates.");
          }
        } catch (error) {
          console.error("Error parsing file:", error);
          alert("Error parsing file. Please ensure the file is a valid JSON.");
        }
      };
      reader.onerror = (error) => {
        console.error("File reading error:", error);
        alert("Error reading file. Please try again.");
      };
      reader.readAsText(file);
    } else {
      console.error("No file selected");
      alert("No file selected. Please choose a file to upload.");
    }
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scale = 500 / Math.max(...points.map(p => Math.max(p.x, p.y)), 100);

    // Draw grid
    ctx.strokeStyle = "#ddd";
    ctx.beginPath();
    for (let i = 0; i <= 100; i += 20) {
      ctx.moveTo(i * 5, 0);
      ctx.lineTo(i * 5, 500);
      ctx.moveTo(0, i * 5);
      ctx.lineTo(500, i * 5);
    }
    ctx.stroke();

    // Draw points
    points.forEach((point) => {
      ctx.fillStyle = "#0066FF";
      ctx.beginPath();
      ctx.arc(point.x * scale, point.y * scale, 4, 0, 2 * Math.PI);
      ctx.fill();
    });

    if (states.length > 0) {
      const currentState = states[currentStateIndex];

      // Draw frontier set
      currentState.frontier.forEach((point) => {
        ctx.fillStyle = "#22C55E";
        ctx.beginPath();
        ctx.arc(point.x * scale, point.y * scale, 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = "orange";
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Draw closest pair
      if (currentState.closestPair) {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(
          currentState.closestPair[0].x * scale,
          currentState.closestPair[0].y * scale
        );
        ctx.lineTo(
          currentState.closestPair[1].x * scale,
          currentState.closestPair[1].y * scale
        );
        ctx.stroke();

        currentState.closestPair.forEach((point) => {
          ctx.fillStyle = "red";
          ctx.beginPath();
          ctx.arc(point.x * scale, point.y * scale, 6, 0, 2 * Math.PI);
          ctx.fill();
        });
      }

      // Draw current point
      if (currentState.frontierPoint) {
        ctx.fillStyle = "orange";
        ctx.beginPath();
        ctx.arc(
          currentState.frontierPoint.x * scale,
          currentState.frontierPoint.y * scale,
          6,
          0,
          2 * Math.PI
        );
        ctx.fill();
      }

      // Draw sweep line
      if (currentState.frontierPoint) {
        ctx.strokeStyle = "#22C55E";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(currentState.frontierPoint.x * scale, 0);
        ctx.lineTo(currentState.frontierPoint.x * scale, 500);
        ctx.stroke();
      }

      // Draw zone of interest
      if (currentState.frontierPoint && currentState.d) {
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 2;
        ctx.setLineDash([0.3, 0.3]);
        ctx.beginPath();
        ctx.moveTo(
          currentState.frontierPoint.x * scale,
          (currentState.frontierPoint.y - currentState.d) * scale
        );
        ctx.lineTo(
          currentState.frontierPoint.x * scale,
          (currentState.frontierPoint.y + currentState.d) * scale
        );
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw candidate pair
      if (currentState.frontierPoint && currentState.candidate) {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.setLineDash([0.3, 0.3]);
        ctx.beginPath();
        ctx.moveTo(
          currentState.frontierPoint.x * scale,
          currentState.frontierPoint.y * scale
        );
        ctx.lineTo(currentState.candidate.x * scale, currentState.candidate.y * scale);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  }, [points, states, currentStateIndex]);

  useEffect(() => {
    draw();
  }, [draw]);

  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentStateIndex((prevIndex) =>
          Math.min(states.length - 1, prevIndex + 1)
        );
      }, 100);
      return () => clearInterval(interval);
    }
  }, [states.length, isPlaying]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">
        Closest point pair line-sweep visualiser
      </h1>
      <p className="text-muted-foreground">
        This app helps with visualising the behaviour of the line-sweep
        algorithm for the closest point pair problem in computational geometry.
      </p>

      <div className="space-y-4">
        <div className="flex gap-4 items-center">
          <Input
            type="file"
            onChange={handleFileUpload}
            className="w-64"
            accept=".txt,.csv"
          />
          <Button onClick={() => setShowFileUploadHelp(!showFileUploadHelp)}>
            {showFileUploadHelp ? "Hide" : "Show"} file upload help
          </Button>
        </div>

        {showFileUploadHelp && (
          <p className="text-sm text-muted-foreground">
            Upload a text file with comma-separated x,y coordinates, one pair
            per line.
          </p>
        )}

        <div className="flex gap-4 items-center">
          <Button onClick={clearPoints}>Clear</Button>
          <Button onClick={generatePoints}>Add {numPoints} points</Button>
          <div className="flex-1">
            <Slider
              value={[numPoints]}
              onValueChange={(values) => setNumPoints(values[0])}
              max={100}
              step={1}
            />
          </div>
        </div>

        <div className="border rounded-lg p-4 bg-background">
          <canvas
            ref={canvasRef}
            width={500}
            height={500}
            className="w-full aspect-square bg-white"
          />
        </div>

        <div className="space-y-4">
            <div className="flex gap-4">
            <Button
              onClick={() =>
              setCurrentStateIndex(Math.max(0, currentStateIndex - 1))
              }
              disabled={currentStateIndex <= 0}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              onClick={() =>
              setCurrentStateIndex(
                Math.min(states.length - 1, currentStateIndex + 1)
              )
              }
              disabled={currentStateIndex >= states.length - 1}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            </div>

          <div className="flex gap-4 items-center">
            <span>State</span>
            <Slider
              value={[currentStateIndex]}
              onValueChange={(values) => setCurrentStateIndex(values[0])}
              max={states.length - 1}
              step={1}
              className="flex-1"
            />
            <span>
              {/* {points.length} points, state {currentStateIndex + 1} of{" "} */}
              {/* const [isPlaying, setIsPlaying] = useState(false); */}

                <Button onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
            </span>
          </div>
        </div>
        
        <div className="absolute left-20 top-1/2 transform -translate-y-1/2 space-y-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#22C55E]" />
            <span>Frontier set</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>Closest points</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FFD700]" />
            <span>Zone of interest</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FFA500]" />
            <span>Current point</span>
          </div>
        </div>
        <div className="mt-4">
          <Button
            onClick={() => setShowDetails(!showDetails)}
            variant="outline"
            className="w-full flex justify-between items-center"
          >
            Details
            {showDetails ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
            <AnimatePresence>
            {showDetails && (
              <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-muted p-4 rounded-md mt-2"
              >
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <strong>Current step:</strong> {currentStateIndex + 1} / {states.length}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <strong>Time taken:</strong> {(states.length * 0.1).toFixed(2)} seconds
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <strong>Comparisons made:</strong> {comparisons}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <strong>Time complexity:</strong> O(n log n)
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <strong>Space complexity:</strong> O(n)
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <strong>Closest pair of points:</strong> {states[currentStateIndex]?.closestPair?.map(p => `(${p.x.toFixed(2)}, ${p.y.toFixed(2)})`).join(" and ")}
              </motion.p>
              </motion.div>
            )}
            </AnimatePresence>
            </div>
      </div>
    </div>
  );
};



export default function Component() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000); // Simulate loading time
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full relative min-h-screen">
      <div className="flex items-center justify-between p-4 bg-slate-950 text-white">
      <div className="flex items-center">
        <Image src="/visio-logo.svg" alt="App Logo" width={50} height={50} />
        <span className="ml-2 text-xl font-bold">ISIO</span>
      </div>
      </div>  
      {!loading && (
      <motion.div
      initial={{ opacity: 1, zIndex: 50 }}
      animate={{ opacity: 0, zIndex: -1 }}
      transition={{ delay: 2, duration: 1 }}
      className="absolute inset-0 flex justify-center items-center bg-white"
      >
      <Image src="/visio-logo.svg" alt="App Logo" width={250} height={250} className="mb-4 w-250 h-250 max-w-full max-h-full" />
      <h1 className="text-4xl font-bold mb-4 ml-0"> ISIO</h1>
      <motion.h1
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay: 2, duration: 1 }}
      className="text-4xl font-bold mb-4"
      style={{ textTransform: "uppercase" }}
      >
      ISIO
      </motion.h1>
      </motion.div>
      )}
      <Tabs defaultValue="karatsuba" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
      <TabsTrigger value="karatsuba" className="data-[state=active]:bg-black data-[state=active]:text-white">Karatsuba Algorithm</TabsTrigger>
      <TabsTrigger value="closestpair" className="data-[state=active]:bg-black data-[state=active]:text-white">Closest Pair of Points</TabsTrigger>
      </TabsList>
      <AnimatePresence>
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 100, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <TabsContent value="karatsuba">
          <KaratsubaVisualization />
        </TabsContent>
      </motion.div>
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -100, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <TabsContent value="closestpair">
          <ClosestPairVisualizer />
        </TabsContent>
      </motion.div>
      </AnimatePresence>
      </Tabs>
    </div>
  );
}

