export interface PseudoCodeData {
  steps: string[];
  pseudocode: string;
}

export const PSEUDOCODE_DATA: Record<string, PseudoCodeData> = {
  'bubble': {
    steps: [
      "Start from the first element.",
      "Compare the current element with the next element.",
      "If the current element is greater than the next, swap them.",
      "Move to the next element and repeat until the end of the array.",
      "Repeat the entire process for n-1 passes."
    ],
    pseudocode: `procedure bubbleSort(list)
   for i from 0 to list.length - 1
      for j from 0 to list.length - i - 1
         if list[j] > list[j + 1]
            swap(list[j], list[j + 1])
         end if
      end for
   end for
end procedure`
  },
  'insertion': {
    steps: [
      "Assume the first element is already sorted.",
      "Pick the next element (key).",
      "Compare the key with elements in the sorted part (to its left).",
      "Shift elements in the sorted part to the right if they are greater than the key.",
      "Insert the key into its correct position."
    ],
    pseudocode: `procedure insertionSort(list)
   for i from 1 to list.length - 1
      key = list[i]
      j = i - 1
      while j >= 0 and list[j] > key
         list[j + 1] = list[j]
         j = j - 1
      end while
      list[j + 1] = key
   end for
end procedure`
  },
  'merge-sort': {
    steps: [
      "Divide the array into two halves.",
      "Recursively sort the left half.",
      "Recursively sort the right half.",
      "Merge the two sorted halves back together into a single sorted array."
    ],
    pseudocode: `procedure mergeSort(list)
   if list.length <= 1 return list
   
   mid = floor(list.length / 2)
   left = mergeSort(list[0...mid])
   right = mergeSort(list[mid...end])
   
   return merge(left, right)
end procedure

procedure merge(left, right)
   result = []
   while left and right are not empty
      if left[0] <= right[0]
         append left[0] to result
         remove left[0]
      else
         append right[0] to result
         remove right[0]
      end if
   end while
   append remaining elements to result
   return result
end procedure`
  },
  'quick-sort': {
    steps: [
      "Pick an element as a pivot.",
      "Partition the array such that elements smaller than pivot are on the left, and larger are on the right.",
      "Recursively apply the same logic to the left and right sub-arrays."
    ],
    pseudocode: `procedure quickSort(list, low, high)
   if low < high
      p = partition(list, low, high)
      quickSort(list, low, p - 1)
      quickSort(list, p + 1, high)
   end if
end procedure

procedure partition(list, low, high)
   pivot = list[high]
   i = low - 1
   for j from low to high - 1
      if list[j] < pivot
         i = i + 1
         swap(list[i], list[j])
      end if
   end for
   swap(list[i + 1], list[high])
   return i + 1
end procedure`
  },
  'min-max': {
    steps: [
      "If the array has only one element, return it as both min and max.",
      "If the array has two elements, compare them and return the smaller as min and larger as max.",
      "Otherwise, divide the array into two halves.",
      "Recursively find min and max for both halves.",
      "Compare the mins of both halves to find the overall min.",
      "Compare the maxes of both halves to find the overall max."
    ],
    pseudocode: `procedure getMinMax(list, low, high)
   if low == high
      return {min: list[low], max: list[low]}
   end if
   
   if high == low + 1
      if list[low] < list[high]
         return {min: list[low], max: list[high]}
      else
         return {min: list[high], max: list[low]}
      end if
   end if
   
   mid = floor((low + high) / 2)
   left = getMinMax(list, low, mid)
   right = getMinMax(list, mid + 1, high)
   
   return {
      min: min(left.min, right.min),
      max: max(left.max, right.max)
   }
end procedure`
  },
  'linear-search': {
    steps: [
      "Start from the first element of the array.",
      "Compare the target value with the current element.",
      "If they match, return the current index.",
      "If not, move to the next element.",
      "Repeat until the target is found or the end of the array is reached."
    ],
    pseudocode: `procedure linearSearch(list, target)
   for i from 0 to list.length - 1
      if list[i] == target
         return i
      end if
   end for
   return -1
end procedure`
  },
  'binary-search': {
    steps: [
      "Ensure the array is sorted.",
      "Set low to 0 and high to the last index.",
      "Calculate mid = (low + high) / 2.",
      "If target == list[mid], return mid.",
      "If target < list[mid], set high = mid - 1.",
      "If target > list[mid], set low = mid + 1.",
      "Repeat until target is found or low > high."
    ],
    pseudocode: `procedure binarySearch(list, target)
   low = 0
   high = list.length - 1
   while low <= high
      mid = floor((low + high) / 2)
      if list[mid] == target
         return mid
      else if list[mid] < target
         low = mid + 1
      else
         high = mid - 1
      end if
   end while
   return -1
end procedure`
  },
  'bfs': {
    steps: [
      "Create a queue and enqueue the starting node.",
      "Mark the starting node as visited.",
      "While the queue is not empty:",
      "  Dequeue a node and process it.",
      "  For each unvisited neighbor of the dequeued node:",
      "    Mark it as visited and enqueue it."
    ],
    pseudocode: `procedure BFS(graph, startNode)
   queue = [startNode]
   visited = {startNode}
   while queue is not empty
      node = dequeue(queue)
      process(node)
      for neighbor in graph.neighbors(node)
         if neighbor not in visited
            visited.add(neighbor)
            enqueue(queue, neighbor)
         end if
      end for
   end while
end procedure`
  },
  'dfs': {
    steps: [
      "Mark the current node as visited.",
      "Process the current node.",
      "For each unvisited neighbor of the current node:",
      "  Recursively call DFS for that neighbor."
    ],
    pseudocode: `procedure DFS(graph, node, visited)
   visited.add(node)
   process(node)
   for neighbor in graph.neighbors(node)
      if neighbor not in visited
         DFS(graph, neighbor, visited)
      end if
   end for
end procedure`
  },
  'knapsack-fractional': {
    steps: [
      "Calculate the value-to-weight ratio for each item.",
      "Sort items in descending order of their ratio.",
      "Iterate through the sorted items.",
      "If the item's weight is less than or equal to the remaining capacity, take the whole item.",
      "If the item's weight is greater than the remaining capacity, take a fraction of the item to fill the capacity."
    ],
    pseudocode: `procedure fractionalKnapsack(items, capacity)
   sort items by (value / weight) in descending order
   totalValue = 0
   for each item in items
      if capacity == 0 return totalValue
      
      amount = min(item.weight, capacity)
      totalValue = totalValue + amount * (item.value / item.weight)
      capacity = capacity - amount
   end for
   return totalValue
end procedure`
  },
  'huffman-coding': {
    steps: [
      "Create a leaf node for each unique character and build a min-priority queue of all leaf nodes.",
      "While there is more than one node in the queue:",
      "  Remove the two nodes with the lowest frequency.",
      "  Create a new internal node with a frequency equal to the sum of the two nodes' frequencies.",
      "  Make the two nodes children of this new node.",
      "  Add the new node to the priority queue.",
      "The remaining node is the root of the Huffman tree."
    ],
    pseudocode: `procedure huffmanCoding(chars, freqs)
   n = chars.length
   Q = priority_queue()
   for i from 1 to n
      Q.insert(new Node(chars[i], freqs[i]))
   end for
   
   for i from 1 to n - 1
      left = Q.extractMin()
      right = Q.extractMin()
      z = new Node(frequency = left.freq + right.freq)
      z.left = left
      z.right = right
      Q.insert(z)
   end for
   return Q.extractMin()
end procedure`
  },
  'kruskal-mst': {
    steps: [
      "Sort all edges in non-decreasing order of their weight.",
      "Pick the smallest edge. Check if it forms a cycle with the spanning tree formed so far.",
      "If it doesn't form a cycle, include this edge. Else, discard it.",
      "Repeat until there are V-1 edges in the spanning tree."
    ],
    pseudocode: `procedure kruskalMST(graph)
   A = {}
   for each vertex v in graph.V
      makeSet(v)
   end for
   
   sort edges in non-decreasing order of weight
   
   for each edge (u, v) in sorted edges
      if findSet(u) != findSet(v)
         A = A U {(u, v)}
         union(u, v)
      end if
   end for
   return A
end procedure`
  },
  'prim-mst': {
    steps: [
      "Initialize a tree with a single vertex, chosen arbitrarily from the graph.",
      "Grow the tree by one edge: of the edges that connect the tree to vertices not yet in the tree, find the minimum-weight edge, and transfer it to the tree.",
      "Repeat until all vertices are in the tree."
    ],
    pseudocode: `procedure primMST(graph, root)
   for each vertex u in graph.V
      u.key = infinity
      u.parent = NIL
   end for
   root.key = 0
   Q = priority_queue(graph.V)
   
   while Q is not empty
      u = Q.extractMin()
      for each v in graph.adj[u]
         if v in Q and weight(u, v) < v.key
            v.parent = u
            v.key = weight(u, v)
            Q.decreaseKey(v, v.key)
         end if
      end for
   end while
end procedure`
  },
  'n-queens': {
    steps: [
      "Start in the leftmost column.",
      "If all queens are placed, return true.",
      "Try all rows in the current column.",
      "For each row, check if the queen can be placed safely.",
      "If yes, place the queen and recursively try to place the rest.",
      "If placing leads to a solution, return true.",
      "If not, remove the queen (backtrack) and try the next row."
    ],
    pseudocode: `procedure solveNQueens(board, col)
   if col >= N return true
   
   for i from 0 to N - 1
      if isSafe(board, i, col)
         board[i][col] = 1
         if solveNQueens(board, col + 1)
            return true
         end if
         board[i][col] = 0 // Backtrack
      end for
   end for
   return false
end procedure`
  },
  'knapsack-01': {
    steps: [
      "Create a 2D table dp[n+1][W+1].",
      "Initialize the first row and column to 0.",
      "For each item i and capacity w:",
      "  If weight[i] <= w:",
      "    dp[i][w] = max(val[i] + dp[i-1][w-weight[i]], dp[i-1][w])",
      "  Else:",
      "    dp[i][w] = dp[i-1][w]",
      "Return dp[n][W]."
    ],
    pseudocode: `procedure knapsack01(weights, values, W)
   n = weights.length
   dp = array[n+1][W+1] initialized to 0
   
   for i from 1 to n
      for w from 1 to W
         if weights[i-1] <= w
            dp[i][w] = max(values[i-1] + dp[i-1][w-weights[i-1]], dp[i-1][w])
         else
            dp[i][w] = dp[i-1][w]
         end if
      end for
   end for
   return dp[n][W]
end procedure`
  },
  'lcs': {
    steps: [
      "Create a 2D table dp[m+1][n+1].",
      "If characters match: dp[i][j] = 1 + dp[i-1][j-1].",
      "If characters don't match: dp[i][j] = max(dp[i-1][j], dp[i][j-1]).",
      "The value at dp[m][n] is the length of the LCS."
    ],
    pseudocode: `procedure LCS(X, Y)
   m = X.length, n = Y.length
   dp = array[m+1][n+1]
   
   for i from 0 to m
      for j from 0 to n
         if i == 0 or j == 0
            dp[i][j] = 0
         else if X[i-1] == Y[j-1]
            dp[i][j] = 1 + dp[i-1][j-1]
         else
            dp[i][j] = max(dp[i-1][j], dp[i][j-1])
      end for
   end for
   return dp[m][n]
end procedure`
  },
  'kadane': {
    steps: [
      "Initialize max_so_far and max_ending_here to the first element.",
      "Iterate through the array starting from the second element.",
      "Update max_ending_here = max(current_element, max_ending_here + current_element).",
      "Update max_so_far = max(max_so_far, max_ending_here).",
      "Return max_so_far."
    ],
    pseudocode: `procedure kadane(arr)
   max_so_far = arr[0]
   max_ending_here = arr[0]
   
   for i from 1 to arr.length - 1
      max_ending_here = max(arr[i], max_ending_here + arr[i])
      max_so_far = max(max_so_far, max_ending_here)
   end for
   return max_so_far
end procedure`
  },
  'floyd-warshall': {
    steps: [
      "Initialize the distance matrix with direct edge weights.",
      "Set distance to self as 0 and no edge as infinity.",
      "For each intermediate vertex k:",
      "  For each source vertex i:",
      "    For each destination vertex j:",
      "      dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])"
    ],
    pseudocode: `procedure floydWarshall(graph)
   dist = matrix(V x V) initialized to infinity
   for each edge (u, v) with weight w
      dist[u][v] = w
   for i from 1 to V
      dist[i][i] = 0
      
   for k from 1 to V
      for i from 1 to V
         for j from 1 to V
            if dist[i][j] > dist[i][k] + dist[k][j]
               dist[i][j] = dist[i][k] + dist[k][j]
            end if
         end for
      end for
   end for
end procedure`
  },
  'sum-of-subsets': {
    steps: [
      "Sort the set in non-decreasing order.",
      "Use recursion to explore including or excluding the current element.",
      "If the current sum equals the target, a subset is found.",
      "If the current sum exceeds the target or no elements are left, backtrack."
    ],
    pseudocode: `procedure sumOfSubsets(currentSum, index, target)
   if currentSum == target
      print currentSubset
      return
   end if
   
   if index >= set.length or currentSum > target
      return
   end if
   
   // Include element
   currentSubset.add(set[index])
   sumOfSubsets(currentSum + set[index], index + 1, target)
   
   // Exclude element (Backtrack)
   currentSubset.removeLast()
   sumOfSubsets(currentSum, index + 1, target)
end procedure`,
  },
  'hamiltonian-circuit': {
    steps: [
      "Start from an arbitrary vertex as the root.",
      "Try adding adjacent vertices to the path one by one.",
      "Check if the added vertex is already in the path and if there is an edge from the previous vertex.",
      "If all vertices are included and there is an edge from the last vertex to the first, a circuit is found.",
      "If a vertex doesn't lead to a solution, backtrack and try another neighbor."
    ],
    pseudocode: `procedure hamCycle(graph, path, pos)
   if pos == V
      if graph[path[pos-1]][path[0]] == 1
         return true
      else
         return false
   end if
   
   for v from 1 to V-1
      if isSafe(v, graph, path, pos)
         path[pos] = v
         if hamCycle(graph, path, pos + 1)
            return true
         end if
         path[pos] = -1 // Backtrack
      end if
   end for
   return false
end procedure`
  },
  'closest-pair': {
    steps: [
      "Sort the points according to their x-coordinates.",
      "Divide the set of points into two equal halves.",
      "Recursively find the smallest distance in both halves (d1, d2).",
      "Let d = min(d1, d2).",
      "Create a strip of points whose x-coordinate is within distance d from the dividing line.",
      "Sort the points in the strip according to their y-coordinates.",
      "Find the smallest distance in the strip and update d if a smaller distance is found."
    ],
    pseudocode: `procedure closestPair(P)
   sort P by x-coordinate
   return closestRecursive(P)
end procedure

procedure closestRecursive(P)
   if P.length <= 3
      return bruteForceClosest(P)
   end if
   
   mid = P.length / 2
   midPoint = P[mid]
   
   dl = closestRecursive(P[0...mid])
   dr = closestRecursive(P[mid...end])
   d = min(dl, dr)
   
   strip = []
   for point in P
      if abs(point.x - midPoint.x) < d
         strip.add(point)
      end if
   end for
   
   return min(d, stripClosest(strip, d))
end procedure`
  },
  'convex-hull': {
    steps: [
      "Find the point with the lowest y-coordinate (anchor).",
      "Sort the remaining points in increasing order of the angle they and the anchor point make with the x-axis.",
      "Iterate through the sorted points.",
      "For each point, keep removing the last point from the hull if it makes a non-left turn.",
      "Add the current point to the hull."
    ],
    pseudocode: `procedure grahamScan(points)
   p0 = point with minimum y-coordinate
   sort points by polar angle with p0
   
   hull = [p0, points[1], points[2]]
   for i from 3 to points.length - 1
      while angle(hull[second-last], hull[last], points[i]) <= 0
         hull.pop()
      end while
      hull.push(points[i])
   end for
   return hull
end procedure`
  },
  'strassen': {
    steps: [
      "Divide the input matrices A and B into n/2 x n/2 sub-matrices.",
      "Calculate 7 products (P1 to P7) using specific combinations of sub-matrices.",
      "Combine these products to form the sub-matrices of the result matrix C.",
      "Strassen's method reduces the number of recursive multiplications from 8 to 7."
    ],
    pseudocode: `procedure strassen(A, B)
   if n == 1 return A * B
   
   Divide A and B into 4 sub-matrices each
   
   P1 = A11 * (B12 - B22)
   P2 = (A11 + A12) * B22
   P3 = (A21 + A22) * B11
   P4 = A22 * (B21 - B11)
   P5 = (A11 + A22) * (B11 + B22)
   P6 = (A12 - A22) * (B21 + B22)
   P7 = (A11 - A21) * (B11 + B12)
   
   C11 = P5 + P4 - P2 + P6
   C12 = P1 + P2
   C21 = P3 + P4
   C22 = P5 + P1 - P3 - P7
   
   return C
end procedure`
  },
  'knapsack-bb': {
    steps: [
      "Sort items by value/weight ratio.",
      "Use a priority queue to explore nodes in the state space tree (Best-First Search).",
      "For each node, calculate an upper bound on the maximum possible value.",
      "If the upper bound is less than the current maximum value, prune the node.",
      "Otherwise, branch by including or excluding the next item."
    ],
    pseudocode: `procedure knapsackBB(items, W)
   sort items by ratio
   Q = priority_queue()
   Q.insert(rootNode)
   maxVal = 0
   
   while Q is not empty
      u = Q.extractMax()
      if u.bound > maxVal
         v = nextNode(u, includeItem)
         if v.weight <= W and v.value > maxVal
            maxVal = v.value
         end if
         if v.bound > maxVal
            Q.insert(v)
         end if
         
         v = nextNode(u, excludeItem)
         if v.bound > maxVal
            Q.insert(v)
         end if
      end if
   end while
   return maxVal
end procedure`
  },
  'tsp': {
    steps: [
      "Represent the problem as a state space tree where each node is a partial tour.",
      "Use a cost function to calculate a lower bound for each node.",
      "The lower bound is typically calculated using the sum of the two smallest edges for each vertex.",
      "Explore the tree using Branch and Bound (e.g., Best-First Search).",
      "Prune nodes whose lower bound is greater than the current shortest tour found."
    ],
    pseudocode: `procedure solveTSP(graph)
   Q = priority_queue()
   Q.insert(rootNode)
   minCost = infinity
   
   while Q is not empty
      u = Q.extractMin()
      if u.bound < minCost
         for each neighbor v of u.lastCity
            if v not in u.path
               newNode = branch(u, v)
               if newNode.isComplete
                  minCost = min(minCost, newNode.cost)
               else if newNode.bound < minCost
                  Q.insert(newNode)
               end if
            end if
         end for
      end if
   end while
   return minCost
end procedure`
  },
  'rabin-karp': {
    steps: [
      "Calculate the hash value of the pattern.",
      "Calculate the hash value of the first window of text.",
      "Slide the window over the text one by one.",
      "If the hash values match, check the characters one by one.",
      "If they match, a pattern is found at that index.",
      "Update the hash value for the next window using the rolling hash technique."
    ],
    pseudocode: `procedure rabinKarp(text, pattern, d, q)
   n = text.length, m = pattern.length
   h = d^(m-1) mod q
   p = 0, t = 0
   
   for i from 0 to m-1
      p = (d*p + pattern[i]) mod q
      t = (d*t + text[i]) mod q
      
   for i from 0 to n-m
      if p == t
         if text[i...i+m-1] == pattern
            print "Pattern found at index " + i
         end if
      end if
      if i < n-m
         t = (d*(t - text[i]*h) + text[i+m]) mod q
         if t < 0 then t = t + q
      end if
   end for
end procedure`
  },
  'matrix-chain': {
    steps: [
      "Create a 2D table m[n][n] to store minimum multiplications.",
      "Initialize m[i][i] = 0 for all i.",
      "For chain length L from 2 to n:",
      "  For each possible start i:",
      "    Calculate end j = i + L - 1.",
      "    Find the split point k that minimizes m[i][k] + m[k+1][j] + p[i-1]*p[k]*p[j].",
      "    Store the minimum value in m[i][j]."
    ],
    pseudocode: `procedure matrixChainOrder(p)
   n = p.length - 1
   m = array[n+1][n+1]
   
   for i from 1 to n
      m[i][i] = 0
      
   for L from 2 to n
      for i from 1 to n - L + 1
         j = i + L - 1
         m[i][j] = infinity
         for k from i to j - 1
            q = m[i][k] + m[k+1][j] + p[i-1]*p[k]*p[j]
            if q < m[i][j]
               m[i][j] = q
            end if
         end for
      end for
   end for
   return m[1][n]
end procedure`
  },
  'obst': {
    steps: [
      "Create a 2D table e[1..n+1, 0..n] to store expected search costs.",
      "Create a 2D table w[1..n+1, 0..n] to store sum of probabilities.",
      "Initialize e[i, i-1] = q[i-1] and w[i, i-1] = q[i-1].",
      "For chain length l from 1 to n:",
      "  For each i from 1 to n-l+1:",
      "    j = i + l - 1, e[i, j] = infinity, w[i, j] = w[i, j-1] + p[j] + q[j].",
      "    For each r from i to j: t = e[i, r-1] + e[r+1, j] + w[i, j].",
      "    If t < e[i, j], then e[i, j] = t."
    ],
    pseudocode: `procedure optimalBST(p, q, n)
   e = array[1..n+1, 0..n]
   w = array[1..n+1, 0..n]
   
   for i from 1 to n + 1
      e[i, i-1] = q[i-1]
      w[i, i-1] = q[i-1]
   end for
   
   for l from 1 to n
      for i from 1 to n - l + 1
         j = i + l - 1
         e[i, j] = infinity
         w[i, j] = w[i, j-1] + p[j] + q[j]
         for r from i to j
            t = e[i, r-1] + e[r+1, j] + w[i, j]
            if t < e[i, j]
               e[i, j] = t
            end if
         end for
      end for
   end for
   return e[1, n]
end procedure`
  },
  'vertex-cover': {
    steps: [
      "Initialize an empty set C as the vertex cover.",
      "While there are edges left in the graph:",
      "  Pick an arbitrary edge (u, v).",
      "  Add both u and v to the set C.",
      "  Remove all edges incident to either u or v from the graph.",
      "Return the set C."
    ],
    pseudocode: `procedure approxVertexCover(graph)
   C = {}
   E' = graph.edges
   while E' is not empty
      let (u, v) be an arbitrary edge in E'
      C = C U {u, v}
      remove from E' every edge incident to either u or v
   end while
   return C
end procedure`
  },
  'hiring': {
    steps: [
      "Randomly permute the list of candidates to ensure a random order.",
      "Interview the first candidate and hire them as the best so far.",
      "For each subsequent candidate in the random order:",
      "  Compare the current candidate with the best candidate hired so far.",
      "  If the current candidate is better, hire them and update the best candidate.",
      "The goal is to analyze the expected number of times a new candidate is hired."
    ],
    pseudocode: `procedure randomizedHiring(candidates)
   n = candidates.length
   randomly permute candidates
   best = -infinity
   hiredCount = 0
   
   for i from 1 to n
      if candidates[i].quality > best
         best = candidates[i].quality
         hire(candidates[i])
         hiredCount = hiredCount + 1
      end if
   end for
   return hiredCount
end procedure`
  },
  'hamiltonian': {
    steps: [
      "The Hamiltonian problem is to determine if a graph contains a Hamiltonian circuit.",
      "In the context of complexity (NP-Complete), we use a non-deterministic approach:",
      "1. Non-deterministically 'guess' a permutation of all vertices.",
      "2. Verify in polynomial time if the permutation forms a valid circuit.",
      "3. Check if each adjacent pair in the permutation has an edge in the graph.",
      "4. Check if there is an edge from the last vertex back to the first."
    ],
    pseudocode: `procedure isHamiltonian(G)
   n = G.V.length
   // Non-deterministic step
   path = guessPermutation(G.V)
   
   // Verification step (Polynomial Time)
   for i from 0 to n - 2
      if not G.hasEdge(path[i], path[i+1])
         return false
   end for
   
   if not G.hasEdge(path[n-1], path[0])
      return false
      
   return true
end procedure`
  },
  'sat': {
    steps: [
      "The Boolean Satisfiability Problem (SAT) asks if there is an assignment of truth values to variables that makes a formula true.",
      "1. Identify all unique boolean variables in the formula.",
      "2. Non-deterministically guess a truth assignment (True/False) for each variable.",
      "3. Substitute the guessed values into the formula.",
      "4. Evaluate the formula using boolean logic (AND, OR, NOT).",
      "5. If the result is True, the formula is satisfiable."
    ],
    pseudocode: `procedure isSatisfiable(formula)
   vars = formula.getVariables()
   // Non-deterministic step
   assignment = guessAssignment(vars)
   
   // Verification step (Polynomial Time)
   if evaluate(formula, assignment) == True
      return True
   else
      return False
   end if
end procedure`
  }
};
