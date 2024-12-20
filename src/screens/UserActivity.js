import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import piechart from "../models/PieChart.glb";

function UserActivity() {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const modelRef = useRef(null);

    const [isClosed, setIsClosed] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const defaultPosition = {top:"15%" , left: "15%"};
    const [taskbarItems, setTaskbarItems] = useState([]);
    const [modalPosition, setModalPosition] = useState(defaultPosition);
    const [dragging, setDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (isClosed) return;

        if (isMaximized) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        if (!sceneRef.current) {
            sceneRef.current = new THREE.Scene();
        }

        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;

        if (!cameraRef.current) {
            cameraRef.current = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
            cameraRef.current.position.set(-0.102, 2.25, 5.354);
            cameraRef.current.lookAt(0, 0, 0);
        }

        if (!rendererRef.current) {
            rendererRef.current = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            rendererRef.current.setSize(width, height);
            mountRef.current.appendChild(rendererRef.current.domElement);
        }

        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        sceneRef.current.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7.5);
        sceneRef.current.add(directionalLight);

        if (!modelRef.current) {
            const loader = new GLTFLoader();
            loader.load(
                piechart,
                (gltf) => {
                    const model = gltf.scene;
                    model.position.set(0, 0, 0);
                    model.scale.set(1, 1, 1);
                    model.rotation.x = 126.52;
                    model.rotation.y = 79.89;
                    model.rotation.z = -105.38;
                    modelRef.current = model;
                    sceneRef.current.add(model);

                },
                undefined,
                (error) => console.error("Error loading model:", error)
            );
        }

        const animate = () => {
            requestAnimationFrame(animate);
            rendererRef.current.render(sceneRef.current, cameraRef.current);
        };
        animate();

        return () => {
            if (isClosed) {
                document.body.style.overflow = "auto";
            }
        };
    }, [isClosed, isMaximized]);

    useEffect(() => {
        if (cameraRef.current && rendererRef.current) {
            const width = mountRef.current.clientWidth;
            const height = mountRef.current.clientHeight;
            cameraRef.current.aspect = width / height;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(width, height);
        }
    }, [isMaximized]);

    const handleMouseDown = (event) => {
        if (isMaximized) return;

        setDragging(true);
        const modalRect = event.currentTarget.getBoundingClientRect();
        setDragOffset({
            x: event.clientX - modalRect.left,
            y: event.clientY - modalRect.top,
        });
    };

    const handleMouseMove = (event) => {
        if (!dragging || isMaximized) return;

        const newLeft = event.clientX - dragOffset.x;
        const newTop = event.clientY - dragOffset.y;

        setModalPosition({
            top: `${Math.max(newTop, 0)}px`,
            left: `${Math.max(newLeft, 0)}px`,
        });
    };

    const handleMouseUp = () => {
        setDragging(false);
        setModalPosition(defaultPosition);
    };

    const handleMinimize = () => {
        setIsMinimized(true);
        setTaskbarItems((prevItems) => [...prevItems, "USER ACTIVITY"]);
    };

    const handleRestore = () => {
        setIsMinimized(false);
        setTaskbarItems((prevItems) => prevItems.filter((item) => item !== "USER ACTIVITY"));
    };

    const containerStyle = {
        width: isMaximized ? "100vw" : "50%",
        height: isMaximized ? "100vh" : "50vh",
        position: "absolute",
        top: isMaximized ? "0" : modalPosition.top,
        left: isMaximized ? "0" : modalPosition.left,
        backgroundColor: "#1e1e2f",
        borderRadius: isMaximized ? "0" : "8px",
        overflow: "hidden",
        boxShadow: isMaximized ? "none" : "0 4px 8px rgba(0, 0, 0, 0.2)",
        display: isMinimized ? "none" : "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: dragging ? "grabbing" : "default",
        zIndex: 1000,
    };

    const taskbarStyle = {
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "50px",
        backgroundColor: "#282c34",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "0 10px",
        boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.2)",
        zIndex: 999,
    };

    const taskbarButtonStyle = {
        background: "#007acc",
        color: "white",
        border: "none",
        borderRadius: "4px",
        padding: "5px 10px",
        fontSize: "14px",
        cursor: "pointer",
        marginRight: "8px",
    };


    return (
        <div
            style={{ position: "relative", width: "100%", height: "100vh", backgroundColor: "#1e1e2f" }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            {!isClosed && (
                <div style={containerStyle}>
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            width: "70%",
                            background: "linear-gradient(to right, #00aaff, #004e8e)",
                            color: "black",
                            padding: "10px 15px",
                            fontSize: "18px",
                            fontWeight: "bold",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            zIndex: 10,
                            cursor: "grab",
                        }}
                        onMouseDown={handleMouseDown}
                    >
                        <span>USER ACTIVITY</span>
                        <div style={{ display: "flex", gap: "8px" }}>
                            <button onClick={handleMinimize} style={buttonStyle}>
                                _
                            </button>
                            <button onClick={() => setIsMaximized(!isMaximized)} style={buttonStyle}>
                                {isMaximized ? "🗖" : "⬜"}
                            </button>
                            <button onClick={() => setIsClosed(true)} style={buttonStyle}>
                                X
                            </button>
                        </div>
                    </div>
                    <div
                        style={{
                            position: "absolute",
                            top: isMaximized ? "58%" : "50%",
                            left: isMaximized ? "38%" : "38%",
                            width: "1px",
                            height: isMaximized ? "200px" : "55px",
                            backgroundColor: "#009DAB",
                            transform: isMaximized ? "translate(-50%, -50%) rotate(110deg)" : "translate(-50%, -50%) rotate(130deg)",
                            transformOrigin: "top left",
                        }}
                    ></div>
                    <div
                        style={{
                            position: "absolute",
                            bottom: isMaximized ? "42%" : "42%",
                            right: isMaximized ? "42%" : "40%",
                            width: "1px",
                            height: isMaximized ? "180px" : "70px",
                            backgroundColor: "#662d91",
                            transform: isMaximized ? "translate(100%, 50%) rotate(120deg)" : "translate(100%, 50%) rotate(120deg)",
                            transformOrigin: "bottom right",
                        }}
                    >
                    </div>

                    <div
                        style={{
                            position: "absolute",
                            bottom: isMaximized ? "38%" : "38%",
                            left: isMaximized ? "25%" : "30%",
                            width: "1px",
                            height: isMaximized ? "209px" : "70px",
                            backgroundColor: "#002f6c",
                            transform: isMaximized ? "translate(100%, 50%) rotate(45deg)" : "translate(100%, 50%) rotate(45deg)",
                            transformOrigin: "bottom right",
                        }}
                    >
                    </div>

                    <div
                        style={{
                            position: "absolute",
                            bottom: isMaximized ? "38%" : "38%",
                            left: isMaximized ? "25%" : "30%",
                            width: "1px",
                            height: isMaximized ? "209px" : "70px",
                            backgroundColor: "#002f6c",
                            transform: isMaximized ? "translate(100%, 50%) rotate(45deg)" : "translate(100%, 50%) rotate(45deg)",
                            transformOrigin: "bottom right",
                        }}
                    >
                    </div>
                    <div
                        style={{
                            position: "absolute",
                            bottom: isMaximized ? "73%" : "66%",
                            right: isMaximized ? "48%" : "48%",
                            width: "1px",
                            height: isMaximized ? "190px" : "58px",
                            backgroundColor: "#BA0021",
                            transform: isMaximized ? "translate(100%, 50%) rotate(66deg)" : "translate(100%, 50%) rotate(45deg)",
                            transformOrigin: "bottom right",
                        }}
                    >
                    </div>

                    <div
                        style={{
                            position: "absolute",
                            bottom: isMaximized ? "64%" : "58%",
                            right: isMaximized ? "40%" : "40%",
                            width: "1px",
                            height: isMaximized ? "200px" : "60px",
                            backgroundColor: "#ffa500",
                            transform: isMaximized ? "translate(100%, 50%) rotate(90deg)" : "translate(100%, 50%) rotate(90deg)",
                            transformOrigin: "bottom right",
                        }}
                    >
                    </div>
                    {/* 
                    <svg className="Active-User-Line" style={
            {
              position: "absolute",
              top: "calc(25% + 15px)",
              left: "calc(10% + 70px)",
              width: '100%', height: '100%',
              zIndex: "-1",
            }}>
            <line
              x1="0%"
              y1="0%"
              x2="18%"
              y2="28%"
              stroke="#546373"
              strokeWidth="1"
            />
          </svg>


          <svg className="User-Line" style={
            {
              position: "absolute",
              bottom: isMaximized ? "5%" : "10%",
              right: isMaximized ? "5%" : "10%",
              width: '100%', height: '100%', zIndex: "-1"
            }}>
            <line
              x1="90%"
              y1="90%"
              x2="70%"
              y2="70%"
              stroke="#662d91"
              strokeWidth="1"
            />
          </svg>


          <div className="container">



            <div className="b1">
              <div className="h1-line"></div>
              <div className="v1-line"></div>
              <div className="h2-line"></div>
              <div className="v2-line"></div>
              <div className="h4-line"></div>
              <div className="h5-line"></div>
            </div>

          </div>


 */}


                    <div className="container">



                        <div className="b1">
                            <div className="h1-line"></div>
                            <div className="v1-line"></div>
                            <div className="h2-line"></div>
                            <div className="v2-line"></div>
                            <div className="h4-line"></div>
                            <div className="h5-line"></div>
                        </div>

                    </div>

                    <div
                        style={{
                            position: "absolute",
                            top: "30%",
                            left: "20%",
                            transform: "translate(0, -50%)",
                            backgroundColor: "#009DAB",
                            color: "white",
                            padding: "6px 18px",
                            borderRadius: "8px",
                            fontSize: "10px",
                            fontWeight: "bold",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                        }}
                    >
                        25% Users
                    </div>

                    <div
                        style={{
                            position: "absolute",
                            bottom: "20%",
                            left: "20%",
                            transform: "translate(0, -50%)",
                            backgroundColor: "#002f6c",
                            color: "white",
                            padding: "6px 18px",
                            borderRadius: "8px",
                            fontSize: "10px",
                            fontWeight: "bold",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                        }}
                    >
                        20% Users
                    </div>
                    <div
                        style={{
                            position: "absolute",
                            top: "30%",
                            right: "30%",
                            transform: "translate(0, -50%)",
                            backgroundColor: "#BA0021",
                            color: "white",
                            padding: "6px 18px",
                            borderRadius: "8px",
                            fontSize: "10px",
                            fontWeight: "bold",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                        }}
                    >
                        5% Users
                    </div>

                    <div
                        style={{
                            position: "absolute",
                            top: "50%",
                            right: "20%",
                            transform: "translate(0, -50%)",
                            backgroundColor: "#ffa500",
                            color: "white",
                            padding: "6px 18px",
                            borderRadius: "8px",
                            fontSize: "10px",
                            fontWeight: "bold",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                        }}
                    >
                        20% Users
                    </div>
                    <div
                        style={{
                            position: "absolute",
                            bottom: "10%",
                            right: "30%",
                            transform: "translate(0, -50%)",
                            backgroundColor: "#720e9e",
                            color: "white",
                            padding: "6px 18px",
                            borderRadius: "8px",
                            fontSize: "10px",
                            fontWeight: "bold",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                        }}
                    >
                        30% Users
                    </div>
                    <div ref={mountRef} style={{ width: "100%", height: "100%" }}></div>

                </div>
            )}

            <div style={taskbarStyle}>
                {taskbarItems.map((item, index) => (
                    <button key={index} style={taskbarButtonStyle} onClick={handleRestore}>
                        {item}
                    </button>
                ))}
            </div>
        </div>
    );
}

const buttonStyle = {
    background: "#00aaff",
    color: "black",
    border: "none",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    fontSize: "10px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
};

export default UserActivity;