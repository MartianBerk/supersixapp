// This should eventually be something that can be included in a reporting module of some description.
import React, { useEffect, useRef } from 'react';


const LineGraph = props => {
    const canvasRef = useRef(null);

    function drawLine(context, startX, startY, endX, endY, lineWidth=2) {
        context.lineWidth = lineWidth;
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

        // Determine fill style
        if (props.backgroundColourGradient) {
            const gradient = context.createLinearGradient(0, props.height, 0, -200);
            gradient.addColorStop(0, props.backgroundColour);
            gradient.addColorStop(1, props.backgroundColourGradientFinish);
            context.fillStyle = gradient;
        }
        else {
            context.fillStyle = props.backgroundColour;
        }

        const leftIndent = 30;
        const rightIndent = 10
        const bottomIndent = 20;
        const topIndent = 20;
        const xLength = props.width - leftIndent - rightIndent;
        const yLength = props.height - bottomIndent - topIndent;

        // draw graph outline
        context.strokeStyle = props.axisColour;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        
        // draw x axis
        drawLine(context, leftIndent, props.height - bottomIndent, xLength, props.height - bottomIndent)

        // draw y axis
        drawLine(context, leftIndent, props.height - bottomIndent, leftIndent, topIndent)

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

        // add x axis grid lines
        if (props.gridColour) {
            context.fillStyle = props.gridColour;
            context.strokeStyle = props.gridColour;

            let i = 0;
            xRange.forEach(_value => {
                // draw grid lines
                drawLine(context, leftIndent + ((xLength - leftIndent) / (xRange.size - 1) * i), props.height - bottomIndent, leftIndent + ((xLength - leftIndent) / (xRange.size - 1) * i), topIndent, 0.2);

                i++;
            });
        }
        
        // add y axis labels
        let yRange = new Array(yMax);
        for (let i = 0; i <= yRange.length; i++) {
            context.fillStyle = props.textColour;
            context.strokeStyle = props.textColour;
            context.fillText(i, leftIndent / 2, props.height - bottomIndent - (yLength / yMax * i));
            
            // draw grid lines
            if (props.gridColour) {
                context.fillStyle = props.gridColour;
                context.strokeStyle = props.gridColour;
                drawLine(context, leftIndent, props.height - bottomIndent - (yLength / yMax * i), xLength, props.height - bottomIndent - (yLength / yMax * i), 0.2);
            }
        }

        // draw graph data
        props.data.forEach(line => {
            context.lineWidth = 2;
            context.strokeStyle = line.lineColour;

            // starting block
            var lastX = null;
            var lastY = null;

            line[props.graphData].forEach((linePart, i) => {
                if (!lastX) {
                    var startX = endX = lastX = leftIndent + ((xLength - leftIndent) / (xRange.size - 1) * i);
                    var startY = endY = lastY = props.height - bottomIndent - (yLength / yMax) * linePart[props.yAxis];
                }
                else {
                    var startX = lastX;
                    var startY = lastY;
                    var endX = lastX = leftIndent + ((xLength - leftIndent) / (xRange.size - 1) * i);
                    var endY = lastY = props.height - bottomIndent - (yLength / yMax) * linePart[props.yAxis];

                    drawLine(context, startX, startY, endX, endY, 1.5);
                }
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