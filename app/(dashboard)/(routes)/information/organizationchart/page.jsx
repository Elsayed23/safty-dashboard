"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CirclePlus } from "lucide-react";
import React, { useState, useCallback } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import ReactFlow, { MiniMap, Controls, Background, addEdge, Handle, useNodesState, useEdgesState } from "reactflow";
import "reactflow/dist/style.css";

const initialNodes = [
    {
        id: "1",
        type: "customNode",
        data: { role: "Manager", name: "Mohamed Saeed", phone: "+20 1123666713", located: "SA", image: "https://pps.whatsapp.net/v/t61.24694-24/473403405_1214195680282907_4296515366165571221_n.jpg?ccb=11-4&oh=01_Q5AaIEfvFQ2GKmJV2vPrrU3XV8C6JUI7E_tNGSnKM4KerpCO&oe=67CB7900&_nc_sid=5e03e0&_nc_cat=103" },
        position: { x: 300, y: 50 },
    },
    {
        id: "2",
        type: "customNode",
        data: { role: "Team Lead", name: "Fatima Saeed", phone: "+20 1152598562", located: "EG", image: "https://pps.whatsapp.net/v/t61.24694-24/473403405_1214195680282907_4296515366165571221_n.jpg?ccb=11-4&oh=01_Q5AaIEfvFQ2GKmJV2vPrrU3XV8C6JUI7E_tNGSnKM4KerpCO&oe=67CB7900&_nc_sid=5e03e0&_nc_cat=103" },
        position: { x: 100, y: 300 },
    },
    {
        id: "3",
        type: "customNode",
        data: { role: "Team Lead", name: "Elsayed Kewan", phone: "+20 1040578478", located: "EG", image: "https://pps.whatsapp.net/v/t61.24694-24/473403405_1214195680282907_4296515366165571221_n.jpg?ccb=11-4&oh=01_Q5AaIEfvFQ2GKmJV2vPrrU3XV8C6JUI7E_tNGSnKM4KerpCO&oe=67CB7900&_nc_sid=5e03e0&_nc_cat=103" },
        position: { x: 500, y: 300 },
    },
];


const initialEdges = [
    { id: "e1-2", source: "1", target: "2" },
    { id: "e1-3", source: "1", target: "3" },
];

const CustomNode = ({ data, id }) => {
    return (
        <div className="bg-white rounded-md shadow-md">
            <h1 className="bg-[#ec7831] py-2 rounded-t-md text-white text-center">{data.role}</h1>
            <div className="flex gap-2 p-4">
                {/* <p><strong>Role:</strong> {data.role}</p> */}
                {data.image && <img src={data.image} alt={data.name} className="w-16 h-24 object-cover" />}
                <div className="space-y-3">
                    <p><strong>Name:</strong> {data.name}</p>
                    <p><strong>Phone:</strong> {data.phone}</p>
                    <p><strong>Located:</strong> {data.located}</p>
                </div>
            </div>
            <Handle type="source" position="bottom" />
            <Handle type="target" position="top" />
        </div>
    );
};

const OrganizationChart = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [idCounter, setIdCounter] = useState(4);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newNodeData, setNewNodeData] = useState({ role: "", name: "", phone: "", located: "", image: "" });

    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

    const handleAddNode = () => {
        setIsDialogOpen(true);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewNodeData((prevData) => ({ ...prevData, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };


    const handleSaveNode = () => {
        const newNode = {
            id: idCounter.toString(),
            type: "customNode",
            data: { ...newNodeData },
            position: { x: Math.random() * 400, y: Math.random() * 400 },
        };
        setNodes((nds) => [...nds, newNode]);
        setIdCounter(idCounter + 1);
        setIsDialogOpen(false);
        setNewNodeData({ role: "", name: "", phone: "", located: "", image: "" });
    };

    return (
        <div className="w-full h-[calc(100vh-80px)] relative">


            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="absolute top-3 left-3 z-50 flex bg-[#FE5000] hover:bg-[#fe5000e1] items-center gap-1" onClick={handleAddNode}>
                        Add Node <CirclePlus size={18} />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Node</DialogTitle>
                    </DialogHeader>
                    <Input className="border p-2 w-full mb-2" placeholder="Role" value={newNodeData.role} onChange={(e) => setNewNodeData({ ...newNodeData, role: e.target.value })} />
                    <Input className="border p-2 w-full mb-2" placeholder="Name" value={newNodeData.name} onChange={(e) => setNewNodeData({ ...newNodeData, name: e.target.value })} />
                    <Input className="border p-2 w-full mb-2" placeholder="Phone" value={newNodeData.phone} onChange={(e) => setNewNodeData({ ...newNodeData, phone: e.target.value })} />
                    <Input className="border p-2 w-full mb-2" placeholder="Located" value={newNodeData.located} onChange={(e) => setNewNodeData({ ...newNodeData, located: e.target.value })} />
                    <Input type="file" className="border p-2 w-full mb-2" onChange={handleImageUpload} />
                    <DialogFooter className='sm:justify-between'>
                        <Button variant='destructive' onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button className="bg-[#FE5000] hover:bg-[#fe5000e1]" onClick={handleSaveNode}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                className=""
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                nodeTypes={{ customNode: (props) => <CustomNode {...props} /> }}
            >
                <Controls />
                <MiniMap />
                <Background />
            </ReactFlow>
        </div>
    );
};

export default OrganizationChart;