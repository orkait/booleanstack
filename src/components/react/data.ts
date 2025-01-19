interface Node {
    id: string;
    type: string;
    text: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color?: string;
}

interface Edge {
    id: string;
    fromNode: string;
    fromSide: string;
    toNode: string;
    toSide: string;
    color?: string;
}

interface GraphData {
    nodes: Node[];
    edges: Edge[];
}


const data: GraphData = {
    "nodes": [
        { "id": "8e4f4992e5a410ed", "type": "text", "text": "[692. Top K Frequent Words](https://leetcode.com/problems/top-k-frequent-words/description/)", "x": -530, "y": -630, "width": 361, "height": 60, "color": "2" },
        { "id": "d3cfdb4bc2d7037b", "type": "text", "text": "[973. K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin/description/)", "x": -530, "y": -508, "width": 361, "height": 60, "color": "2" },
        { "id": "26b89010b3cd7a24", "type": "text", "text": "[1338. Reduce Array Size to The Half](https://leetcode.com/problems/reduce-array-size-to-the-half/description/)", "x": -530, "y": -142, "width": 361, "height": 60, "color": "2" },
        { "id": "2786e42b1db9e0d5", "type": "text", "text": "[451. Sort Characters By Frequency](https://leetcode.com/problems/sort-characters-by-frequency/description/)", "x": -530, "y": 102, "width": 361, "height": 60, "color": "2" },
        { "id": "21be86b00daec3a3", "type": "text", "text": "[373. Find K Pairs with Smallest Sums](https://leetcode.com/problems/find-k-pairs-with-smallest-sums/description/)", "x": -530, "y": 226, "width": 361, "height": 60, "color": "2" },
        { "id": "63b03b746404b256", "type": "text", "text": "[1167. Minimum Cost to Connect Sticks](https://www.lintcode.com/problem/1872/description)", "x": -530, "y": -391, "width": 361, "height": 71, "color": "2" },
        { "id": "5c2e090678e344e3", "type": "text", "text": "[1675. Minimize Deviation in Array](https://leetcode.com/problems/minimize-deviation-in-array/description/)", "x": -530, "y": -264, "width": 361, "height": 80, "color": "#ff0000" },
        { "id": "09326b6d0f1f6a73", "type": "text", "text": "[1094. Car Pooling](https://leetcode.com/problems/car-pooling/description/)", "x": -530, "y": -24, "width": 361, "height": 64, "color": "2" },
        { "id": "28b764b779f5d9b5", "type": "text", "text": "[295. Find Median from Data Stream](https://leetcode.com/problems/find-median-from-data-stream/description/)", "x": -39, "y": -633, "width": 361, "height": 60, "color": "1" },
        { "id": "e5c3da3a30d85b6c", "type": "text", "text": "[632. Smallest Range Covering Elements from k Lists](https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/description/)", "x": -39, "y": -513, "width": 361, "height": 60, "color": "1" },
        { "id": "937b2c03c35d44e2", "type": "text", "text": "[778. Swim in Rising Water](https://leetcode.com/problems/swim-in-rising-water/description/)", "x": -39, "y": -393, "width": 361, "height": 60, "color": "1" },
        { "id": "dc3b53f84bb9d7c9", "type": "text", "text": "[1293. Shortest Path in a Grid with Obstacles Elimination](https://leetcode.com/problems/shortest-path-in-a-grid-with-obstacles-elimination/description/)", "x": -39, "y": -273, "width": 361, "height": 60, "color": "6" },
        { "id": "3a4b3f2a3bb67ed1", "type": "text", "text": "[871. Minimum Number of Refueling Stops](https://leetcode.com/problems/minimum-number-of-refueling-stops/description/)", "x": -39, "y": -153, "width": 361, "height": 60, "color": "#ff0000" },
        { "id": "fe4477d52b7ac02a", "type": "text", "text": "[502. IPO](https://leetcode.com/problems/ipo/description/)", "x": -39, "y": -33, "width": 361, "height": 60, "color": "#ff0000" },
        { "id": "8ad515042a42ad25", "type": "text", "text": "[23. Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/description/)", "x": -39, "y": -873, "width": 361, "height": 59, "color": "6" },
        { "id": "7cbed3819c98a8ff", "type": "text", "text": "[218. The Skyline Problem](https://leetcode.com/problems/the-skyline-problem/description/)", "x": -39, "y": -753, "width": 361, "height": 60, "color": "#ff0000" },
        { "id": "78fe720d6183b814", "type": "text", "text": "Sweep Line Algorithm", "x": 401, "y": -873, "width": 362, "height": 56, "color": "4" },
        { "id": "e891143abc929deb", "type": "text", "text": "1851. Minimum Interval to Include Each Query", "x": 402, "y": -756, "width": 361, "height": 85, "color": "1" },
        { "id": "71c28c95527b7065", "type": "text", "text": "[215. Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/description/)", "x": -530, "y": -880, "width": 361, "height": 66, "color": "2" },
        { "id": "adf28d33bcf8d28c", "type": "text", "text": "[347. Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/description/)", "x": -530, "y": -754, "width": 361, "height": 60, "color": "2" },
        { "id": "210c7138014e41be", "type": "text", "text": "[703. Kth Largest Element in a Stream](https://leetcode.com/problems/kth-largest-element-in-a-stream/description/)", "x": -1016, "y": -880, "width": 361, "height": 74, "color": "4" },
        { "id": "03fae3d61cd287fb", "type": "text", "text": "[264. Ugly Number II](https://leetcode.com/problems/ugly-number-ii/description/)", "x": -1016, "y": -644, "width": 361, "height": 80, "color": "4" },
        { "id": "fe3878b9d401db93", "type": "text", "text": "[1046. Last Stone Weight](https://leetcode.com/problems/last-stone-weight/description/)", "x": -1016, "y": -514, "width": 361, "height": 74, "color": "4" },
        { "id": "e44fdc76be1587e5", "type": "text", "text": "[378. Kth Smallest Element in a Sorted Matrix](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/description/)", "x": -1016, "y": -755, "width": 361, "height": 61, "color": "4" },
        { "type": "text", "text": "Master Heaps", "id": "6b24cb83c1c140f8", "x": -530, "y": -1480, "width": 361, "height": 60, "color": "6" },
        { "id": "0ca56b7809bebc38", "type": "text", "text": "Min Heap Implementation", "x": -530, "y": -1378, "width": 361, "height": 55, "color": "4" },
        { "id": "d90c18a37d0627cb", "type": "text", "text": "Max Heap Implementation", "x": -530, "y": -1281, "width": 361, "height": 55, "color": "4" },
        { "type": "text", "text": "Questions", "id": "7cdc9c6c7f94f4c1", "x": -530, "y": -1185, "width": 361, "height": 60, "color": "6" },
        { "id": "025d7a6e0322939a", "type": "text", "text": "391. Perfect Rectangle", "x": 402, "y": -619, "width": 361, "height": 50, "color": "1" },
        { "id": "0125f71af03df2bb", "type": "text", "text": "850. Rectangle Area II\n\n\n", "x": 402, "y": -540, "width": 361, "height": 55, "color": "1" }
    ],
    "edges": [
        { "id": "65ea59ba55f6f04c", "fromNode": "210c7138014e41be", "fromSide": "bottom", "toNode": "e44fdc76be1587e5", "toSide": "top", "color": "4" },
        { "id": "7ce962aeca039349", "fromNode": "e44fdc76be1587e5", "fromSide": "bottom", "toNode": "03fae3d61cd287fb", "toSide": "top", "color": "4" },
        { "id": "4d7a8b81349331f4", "fromNode": "03fae3d61cd287fb", "fromSide": "bottom", "toNode": "fe3878b9d401db93", "toSide": "top", "color": "4" },
        { "id": "176551b0ec96a46c", "fromNode": "71c28c95527b7065", "fromSide": "bottom", "toNode": "adf28d33bcf8d28c", "toSide": "top", "color": "2" },
        { "id": "0b3a62f75559a8d6", "fromNode": "adf28d33bcf8d28c", "fromSide": "bottom", "toNode": "8e4f4992e5a410ed", "toSide": "top", "color": "2" },
        { "id": "11251d90e4acd1e7", "fromNode": "8e4f4992e5a410ed", "fromSide": "bottom", "toNode": "d3cfdb4bc2d7037b", "toSide": "top", "color": "2" },
        { "id": "bd2b49afcd80c8fb", "fromNode": "d3cfdb4bc2d7037b", "fromSide": "bottom", "toNode": "63b03b746404b256", "toSide": "top", "color": "2" },
        { "id": "a291bda8e50b4117", "fromNode": "63b03b746404b256", "fromSide": "bottom", "toNode": "5c2e090678e344e3", "toSide": "top", "color": "2" },
        { "id": "2d0d28ccfd925244", "fromNode": "5c2e090678e344e3", "fromSide": "bottom", "toNode": "26b89010b3cd7a24", "toSide": "top", "color": "2" },
        { "id": "0e4bf129b5ede162", "fromNode": "26b89010b3cd7a24", "fromSide": "bottom", "toNode": "09326b6d0f1f6a73", "toSide": "top", "color": "2" },
        { "id": "8fb06d4b9cd25591", "fromNode": "09326b6d0f1f6a73", "fromSide": "bottom", "toNode": "2786e42b1db9e0d5", "toSide": "top", "color": "2" },
        { "id": "cf1bc194e3ec5a22", "fromNode": "2786e42b1db9e0d5", "fromSide": "bottom", "toNode": "21be86b00daec3a3", "toSide": "top", "color": "2" },
        { "id": "b81ebaa22b60c789", "fromNode": "8ad515042a42ad25", "fromSide": "bottom", "toNode": "7cbed3819c98a8ff", "toSide": "top", "color": "1" },
        { "id": "05fa9ede00b756df", "fromNode": "7cbed3819c98a8ff", "fromSide": "bottom", "toNode": "28b764b779f5d9b5", "toSide": "top", "color": "1" },
        { "id": "9cc67f5750c2d032", "fromNode": "28b764b779f5d9b5", "fromSide": "bottom", "toNode": "e5c3da3a30d85b6c", "toSide": "top", "color": "1" },
        { "id": "0b428e22e4c4ffc6", "fromNode": "e5c3da3a30d85b6c", "fromSide": "bottom", "toNode": "937b2c03c35d44e2", "toSide": "top", "color": "1" },
        { "id": "d6c6f04db3f4c453", "fromNode": "937b2c03c35d44e2", "fromSide": "bottom", "toNode": "dc3b53f84bb9d7c9", "toSide": "top", "color": "1" },
        { "id": "bd3486dccf873f80", "fromNode": "dc3b53f84bb9d7c9", "fromSide": "bottom", "toNode": "3a4b3f2a3bb67ed1", "toSide": "top", "color": "1" },
        { "id": "cd9d3c5b81c7da47", "fromNode": "3a4b3f2a3bb67ed1", "fromSide": "bottom", "toNode": "fe4477d52b7ac02a", "toSide": "top", "color": "1" },
        { "id": "282cedfc206cc1b7", "fromNode": "7cdc9c6c7f94f4c1", "fromSide": "bottom", "toNode": "210c7138014e41be", "toSide": "top", "color": "4" },
        { "id": "6a45295abaf9324e", "fromNode": "7cdc9c6c7f94f4c1", "fromSide": "bottom", "toNode": "71c28c95527b7065", "toSide": "top", "color": "2" },
        { "id": "461d82041b5c642a", "fromNode": "d90c18a37d0627cb", "fromSide": "bottom", "toNode": "7cdc9c6c7f94f4c1", "toSide": "top" },
        { "id": "3946d0ca051fe60e", "fromNode": "0ca56b7809bebc38", "fromSide": "bottom", "toNode": "d90c18a37d0627cb", "toSide": "top" },
        { "id": "5656f4bcf146e8bd", "fromNode": "6b24cb83c1c140f8", "fromSide": "bottom", "toNode": "0ca56b7809bebc38", "toSide": "top" },
        { "id": "69d726b846a4340a", "fromNode": "025d7a6e0322939a", "fromSide": "bottom", "toNode": "0125f71af03df2bb", "toSide": "top" },
        { "id": "8b8a27d210e8339f", "fromNode": "7cdc9c6c7f94f4c1", "fromSide": "bottom", "toNode": "78fe720d6183b814", "toSide": "top" },
        { "id": "b188e59280f63afc", "fromNode": "78fe720d6183b814", "fromSide": "bottom", "toNode": "e891143abc929deb", "toSide": "top" },
        { "id": "c1ba9912945753b9", "fromNode": "7cdc9c6c7f94f4c1", "fromSide": "bottom", "toNode": "8ad515042a42ad25", "toSide": "top", "color": "1" },
        { "id": "0c899fb08b7ddbde", "fromNode": "e891143abc929deb", "fromSide": "bottom", "toNode": "025d7a6e0322939a", "toSide": "top" }
    ]
}

export default data;