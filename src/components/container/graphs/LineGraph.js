// This should eventually be something that can be included in a reporting module of some description.
import React, { useEffect, useRef } from 'react';

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

        const leftIndent = 30;
        const rightIndent = 30
        const bottomIndent = 30;
        const topIndent = 30;
        const xLength = props.width - leftIndent - rightIndent;
        const yLength = props.height - bottomIndent - topIndent;

        // draw graph outline
        context.strokeStyle = "#000000";
        context.fillStyle = props.backgroundColour;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height)
        
        // draw x axis
        drawLine(context, leftIndent, props.height - bottomIndent, xLength, props.height - bottomIndent)

        // draw y axis
        drawLine(context, leftIndent, props.height - bottomIndent, leftIndent, bottomIndent)

        // extract ranges
        let xRange = new Set();
        let yMax = 0;

        props.data.forEach(line => {
            line[props.graphData].forEach(data => {
                // add to ranges
                xRange.add(data[props.xAxis]);
                yMax = data[props.yAxis] > yMax ? data[props.yAxis] : yMax;
            });
        });

        // TODO: make x axis labels optional??
        // add x axis labels
        // let i = 0;
        // xRange.forEach(value => {
        //     context.fillStyle = "#000000";
        //     context.fillText(value, leftIndent + (xLength / (xRange.size + 1)) * i, (props.height - bottomIndent));
        //     i++;
        // });

        // add y axis labels
        let yRange = new Array(yMax);
        for (let i = 0; i <= yRange.length; i++) {
            context.fillStyle = "#000000";
            context.strokeStyle = "#000000";
            context.fillText(i/* > 0 ? i : ""*/, leftIndent / 2, props.height - bottomIndent - (yLength / yMax * i));
        }

        // draw graph data
        props.data.forEach(line => {
            context.lineWidth = 3;
            context.strokeStyle = line.lineColour;

            // starting block
            var lastX = null;
            var lastY = null;

            line[props.graphData].forEach((linePart, i) => {
                if (!lastX) {
                    var startX = endX = lastX = leftIndent + (xLength / xRange.size) * i;
                    var startY = endY = lastY = props.height - bottomIndent - (yLength / yMax) * linePart[props.yAxis];
                }
                else {
                    var startX = lastX;
                    var startY = lastY;
                    var endX = lastX = leftIndent + (xLength / xRange.size) * i;
                    var endY = lastY = props.height - bottomIndent - (yLength / yMax) * linePart[props.yAxis];
                }

                drawLine(context, startX, startY, endX, endY);
            });
        });

    }, [props.data]);

    return (
        <div className="linegraph">
            <canvas id={props.graphId} ref={canvasRef}></canvas>
        </div>
    );
}

export default LineGraph;