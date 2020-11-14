// This should eventually be something that can be included in a reporting module of some description.
import React, { Component, useEffect, useRef } from 'react';

import '../../css/graphs/LineGraph.css';

const LineGraph = props => {
    const canvasRef = useRef(null);

    function drawLine(context, startX, startY, endX, endY) {
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.stroke();
    }

    useEffect(() => {
        const canvas = canvasRef.current;

        canvas.width = props.width;
        canvas.height = props.height;

        const context = canvas.getContext("2d");

        // draw graph outline
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height)
        
        // draw x axis
        drawLine(context, 5, props.height - 5, props.width - 5, props.height - 5)

        // draw y axis
        drawLine(context, 5, 5, 5, props.height - 5)

    }, []);

    return (
        <div className="linegraph">
            <canvas id={props.graphId} ref={canvasRef}></canvas>
        </div>
    );
}

export default LineGraph;