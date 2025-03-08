"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CirclePlus } from "lucide-react";
import React, { useState, useCallback } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import ReactFlow, { MiniMap, Controls, Background, addEdge, Handle, useNodesState, useEdgesState, SelectionMode } from "reactflow";
import "reactflow/dist/style.css";

const HORIZONTAL_GAP = 420;
const VERTICAL_GAP = 300;

const xNode2 = (400 - 3 * HORIZONTAL_GAP + 400 - 2 * HORIZONTAL_GAP) / 2;
const xNode3 = (400 - HORIZONTAL_GAP + 400) / 2;
const xNode4 = (400 + HORIZONTAL_GAP + 400 + 2 * HORIZONTAL_GAP) / 2;
const xNode5 = (400 + 3 * HORIZONTAL_GAP + 400 + 4 * HORIZONTAL_GAP) / 2;

const xManager = (xNode2 + xNode3 + xNode4 + xNode5) / 4;


const initialNodes = [
    { id: "1", type: "customNode", data: { role: "Manager", name: "Adnan aldahri", phone: "1051246476", located: "Genaral", employeNumber: 7733, image: "https://res.cloudinary.com/drvysuihb/image/upload/v1741307467/WhatsApp_Image_2025-03-05_at_7.23.57_PM_iiqkhj.jpg" }, position: { x: xManager, y: 50 } },

    { id: "2", type: "customNode", data: { role: "Sr safety officer", name: "Turki ahmed alzubadi", phone: "1084228053", located: "Genaral", employeNumber: 2252, image: "https://res.cloudinary.com/drvysuihb/image/upload/v1741307522/WhatsApp_Image_2025-03-05_at_7.24.58_PM_kdyjjp.jpg" }, position: { x: xNode2, y: 50 + VERTICAL_GAP } },
    { id: "3", type: "customNode", data: { role: "Safety engineer", name: "Mohamed Saeed", phone: "201123666713", located: "EG", employeNumber: 3256, image: "https://res.cloudinary.com/drvysuihb/image/upload/v1741307467/WhatsApp_Image_2025-03-05_at_7.23.57_PM_iiqkhj.jpg" }, position: { x: xNode3, y: 50 + VERTICAL_GAP } },
    { id: "4", type: "customNode", data: { role: "Assistant", name: "Employee 1", phone: "123456789", located: "Genaral", employeNumber: 1111, image: "https://res.cloudinary.com/drvysuihb/image/upload/v1741307467/WhatsApp_Image_2025-03-05_at_7.23.57_PM_iiqkhj.jpg" }, position: { x: xNode4, y: 50 + VERTICAL_GAP } },
    { id: "5", type: "customNode", data: { role: "Assistant", name: "Employee 2", phone: "987654321", located: "Genaral", employeNumber: 2222, image: "https://res.cloudinary.com/drvysuihb/image/upload/v1741307467/WhatsApp_Image_2025-03-05_at_7.23.57_PM_iiqkhj.jpg" }, position: { x: xNode5, y: 50 + VERTICAL_GAP } },

    { id: "6", type: "customNode", data: { role: "Junior", name: "Employee 3", phone: "111111111", located: "Genaral", employeNumber: 3333, image: "https://res.cloudinary.com/drvysuihb/image/upload/v1741307467/WhatsApp_Image_2025-03-05_at_7.23.57_PM_iiqkhj.jpg" }, position: { x: 400 - 3 * HORIZONTAL_GAP, y: 50 + 2 * VERTICAL_GAP } },
    { id: "7", type: "customNode", data: { role: "Junior", name: "Employee 4", phone: "222222222", located: "Genaral", employeNumber: 4444, image: "https://res.cloudinary.com/drvysuihb/image/upload/v1741307467/WhatsApp_Image_2025-03-05_at_7.23.57_PM_iiqkhj.jpg" }, position: { x: 400 - 2 * HORIZONTAL_GAP, y: 50 + 2 * VERTICAL_GAP } },
    { id: "8", type: "customNode", data: { role: "Junior", name: "Employee 5", phone: "333333333", located: "Genaral", employeNumber: 5555, image: "https://res.cloudinary.com/drvysuihb/image/upload/v1741307467/WhatsApp_Image_2025-03-05_at_7.23.57_PM_iiqkhj.jpg" }, position: { x: 400 - HORIZONTAL_GAP, y: 50 + 2 * VERTICAL_GAP } },
    { id: "9", type: "customNode", data: { role: "Junior", name: "Employee 6", phone: "444444444", located: "Genaral", employeNumber: 6666, image: "https://res.cloudinary.com/drvysuihb/image/upload/v1741307467/WhatsApp_Image_2025-03-05_at_7.23.57_PM_iiqkhj.jpg" }, position: { x: 400, y: 50 + 2 * VERTICAL_GAP } },
    { id: "10", type: "customNode", data: { role: "Junior", name: "Employee 7", phone: "555555555", located: "Genaral", employeNumber: 7777, image: "https://res.cloudinary.com/drvysuihb/image/upload/v1741307467/WhatsApp_Image_2025-03-05_at_7.23.57_PM_iiqkhj.jpg" }, position: { x: 400 + HORIZONTAL_GAP, y: 50 + 2 * VERTICAL_GAP } },
    { id: "11", type: "customNode", data: { role: "Junior", name: "Employee 8", phone: "666666666", located: "Genaral", employeNumber: 8888, image: "https://res.cloudinary.com/drvysuihb/image/upload/v1741307467/WhatsApp_Image_2025-03-05_at_7.23.57_PM_iiqkhj.jpg" }, position: { x: 400 + 2 * HORIZONTAL_GAP, y: 50 + 2 * VERTICAL_GAP } },
    { id: "12", type: "customNode", data: { role: "Junior", name: "Employee 9", phone: "777777777", located: "Genaral", employeNumber: 9999, image: "https://res.cloudinary.com/drvysuihb/image/upload/v1741307467/WhatsApp_Image_2025-03-05_at_7.23.57_PM_iiqkhj.jpg" }, position: { x: 400 + 3 * HORIZONTAL_GAP, y: 50 + 2 * VERTICAL_GAP } },
    { id: "13", type: "customNode", data: { role: "Junior", name: "Employee 10", phone: "888888888", located: "Genaral", employeNumber: 1010, image: "https://res.cloudinary.com/drvysuihb/image/upload/v1741307467/WhatsApp_Image_2025-03-05_at_7.23.57_PM_iiqkhj.jpg" }, position: { x: 400 + 4 * HORIZONTAL_GAP, y: 50 + 2 * VERTICAL_GAP } }
];

const initialEdges = [
    { id: "e1-2", source: "1", target: "2" },
    { id: "e1-3", source: "1", target: "3" },
    { id: "e1-4", source: "1", target: "4" },
    { id: "e1-5", source: "1", target: "5" },

    { id: "e2-6", source: "2", target: "6" },
    { id: "e2-7", source: "2", target: "7" },
    { id: "e3-8", source: "3", target: "8" },
    { id: "e3-9", source: "3", target: "9" },
    { id: "e4-10", source: "4", target: "10" },
    { id: "e4-11", source: "4", target: "11" },
    { id: "e5-12", source: "5", target: "12" },
    { id: "e5-13", source: "5", target: "13" },
];


const CustomNode = ({ data, id }) => {
    return (
        <div className="bg-white rounded-md shadow-md min-w-96 max-h-[450px]"> {/* عرض ثابت للعقد */}
            <h1 className="bg-[#ec7831] py-2 rounded-t-md text-white text-center">{data.role}</h1>
            <div className="flex gap-2 p-4">
                {data.image && <img src={data.image} alt={data.name} className="w-20 h-32 object-cover" />}
                <div className="space-y-3">
                    <p><strong>Name:</strong> {data.name}</p>
                    <p><strong>Phone:</strong> {data.phone}</p>
                    <p><strong>Located:</strong> {data.located}</p>
                    <p><strong>Emp N:</strong> {data.employeNumber}</p>
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
    const [idCounter, setIdCounter] = useState(initialNodes.length + 1);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newNodeData, setNewNodeData] = useState({ role: "", name: "", phone: "", located: "", image: "https://res.cloudinary.com/drvysuihb/image/upload/v1741307467/WhatsApp_Image_2025-03-05_at_7.23.57_PM_iiqkhj.jpg" });

    const onConnect = useCallback((params) => setEdges((eds) => addEdge({ ...params, style: { strokeWidth: 3 } }, eds)), []); // زيادة عرض الخيط

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
        setNewNodeData({ role: "", name: "", phone: "", located: "", image: "https://res.cloudinary.com/drvysuihb/image/upload/v1741307467/WhatsApp_Image_2025-03-05_at_7.23.57_PM_iiqkhj.jpg" });
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
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                fitViewOptions={{ padding: 0.1 }}
                minZoom={0.20}
                maxZoom={2}
                nodeTypes={{ customNode: (props) => <CustomNode {...props} /> }}
                panOnScroll
                selectionOnDrag
            >
                <Controls />
                <MiniMap />
                <Background />
            </ReactFlow>
        </div>
    );
};

export default OrganizationChart;