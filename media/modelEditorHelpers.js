var $_ = go.GraphObject.make;
var processModelDiagram;
var ProcessModeller = {};

function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

function loadModelDiagram(diagramDataObj) {
    processModelDiagram.model = new go.GraphLinksModel(diagramDataObj);
}

function getModelDiagram() {
    const currentDiagramObj = processModelDiagram.model.toJSON();
    return currentDiagramObj;
}

function setOnSaveBtnCallback (callback) {
    ProcessModeller.saveProcessModel = function () {
        callback()
    }
}

function setOnChangeCallback(callback) {
    processModelDiagram.addDiagramListener(
        "ChangedSelection",
        function (e) {
            console.log("Changed selection");
            const currentDiagram = getModelDiagram();
            callback(currentDiagram);
            //ProcessModeller.activateMenuOnSelection(e.diagram.selection.iterator.count, e.diagram.selection.iterator.first());
        }
    );
}


processModelDiagram =
    $_(go.Diagram, "processModellerDiagramDiv",
        {
            initialContentAlignment: go.Spot.Center,
            allowDrop: true,
            allowMove: true,
            scrollsPageOnFocus: false,
            "undoManager.isEnabled": true,
            //     isReadOnly: ProcessModeller.processExternalInfo.value.DEPLOYMENT_ID.value ? true : false
        }
    );

// class LinkLabelDraggingTool extends go.Tool {
// //     constructor() {
// //         super();
// //         // Add custom logic here
// //     }
// }

processModelDiagram.toolManager.mouseMoveTools.insertAt(0, new LinkLabelDraggingTool());


processModelDiagram.addDiagramListener(
    "ExternalObjectsDropped",
    function (e) {
        e.subject.iterator.each(
            function (a) {
                processModelDiagram.model.setDataProperty(a.data, "key", "BPM" + uuid());
                ProcessModeller.togglePortsInternal(ProcessModeller.showPorts);
                //ProcessModeller.markDiagramModified();
            }
        );
    }
);

processModelDiagram.addDiagramListener(
    "LinkDrawn",
    function (e) {
        console.log("Link drawn");
        processModelDiagram.model.setDataProperty(e.subject.data, "key", "BPM" + uuid());
        //ProcessModeller.markDiagramModified();
    }
);

processModelDiagram.addDiagramListener(
    "ClipboardPasted",
    function (e) {
        e.subject.iterator.each(
            function (a) {
                processModelDiagram.model.setDataProperty(a.data, "key", "BPM" + uuid());
                ProcessModeller.togglePortsInternal(ProcessModeller.showPorts);
                //ProcessModeller.markDiagramModified();
            }
        );
        ProcessModeller.togglePortsInternal(ProcessModeller.showPorts);
        //ProcessModeller.markDiagramModified();
    }
);

// processModelDiagram.addDiagramListener(
//     "ChangedSelection",
//     function (e) {
//         console.log("Changed selection");
//         //ProcessModeller.activateMenuOnSelection(e.diagram.selection.iterator.count, e.diagram.selection.iterator.first());
//     }
// );

processModelDiagram.addDiagramListener(
    "SelectionCopied",
    function (e) {
        e.subject.iterator.each(
            function (a) {
                processModelDiagram.model.setDataProperty(a.data, "key", "BPM" + uuid());
                ProcessModeller.togglePortsInternal(ProcessModeller.showPorts);
                //ProcessModeller.markDiagramModified();
            }
        );
        ProcessModeller.togglePortsInternal(ProcessModeller.showPorts);
        //ProcessModeller.markDiagramModified();
    }
);

processModelDiagram.addDiagramListener(
    "SelectionDeleted",
    function (e) {
        e.subject.iterator.each(
            function (a) {
                ProcessModeller.deleteObject(a.data.key);
                //ProcessModeller.markDiagramModified();
            }
        );
        ProcessModeller.togglePortsInternal(ProcessModeller.showPorts);
        //ProcessModeller.markDiagramModified();
    }
);

processModelDiagram.nodeTemplateMap.add("Start",
    $_(go.Node, "Auto",
        nodeStyle(),
        $_(go.Panel, "Auto",
            getShape("Circle", "#a3e1d4", "#524d10")
        ),
        port1(), port2(), port3(), port4(),
        getSelectionAdornmentTemplate(),
        {
            toolTip:
                $_(go.Adornment, "Auto",
                    $_(go.Shape, { fill: "lightyellow" }),
                    $_(go.Panel, "Vertical",
                        $_(go.TextBlock, { margin: 5 },
                            new go.Binding("text", "category"))
                    )
                )
        }
    )
);

processModelDiagram.nodeTemplateMap.add("Task",
    $_(go.Node, "Auto", nodeStyle(true),
        $_(go.Panel, "Auto",
            getShape("Rectangle", "#beddf2", "#524d10"),
            getTextBlock(),
        ),
        port1(), port2(), port3(), port4(),
        getSelectionAdornmentTemplate(),
        {
            toolTip:
                $_(go.Adornment, "Auto",
                    $_(go.Shape, { fill: "lightyellow" }),
                    $_(go.Panel, "Vertical",
                        $_(go.TextBlock, { margin: 3 },
                            new go.Binding("text", "category"))
                    )
                )
        }
    )
);

processModelDiagram.nodeTemplateMap.add("XOR",
    $_(go.Node, "Auto",
        nodeStyle(),
        $_(go.Panel, "Auto",
            getShape("Diamond", "#ffd8c4", "#524d10"),
            getShape("XLine", "#000000", "#000000", 4, new go.Size(14, 14)),
        ),
        port1(), port2(), port3(), port4(),
        getSelectionAdornmentTemplate(),
        {
            toolTip:
                $_(go.Adornment, "Auto",
                    $_(go.Shape, { fill: "lightyellow" }),
                    $_(go.Panel, "Vertical",
                        $_(go.TextBlock, { margin: 3 },
                            new go.Binding("text", "category"))
                    )
                )
        }
    )
);

processModelDiagram.nodeTemplateMap.add("Fork",
    $_(go.Node, "Auto",
        nodeStyle(),
        $_(go.Panel, "Auto",
            getShape("Diamond", "#ffd8c4", "#524d10"),
            getShape("PlusLine", "#000000", "#000000", 4, new go.Size(20, 20))
        ),
        port1(), port2(), port3(), port4(),
        getSelectionAdornmentTemplate(),
        {
            toolTip:
                $_(go.Adornment, "Auto",
                    $_(go.Shape, { fill: "lightyellow" }),
                    $_(go.Panel, "Vertical",
                        $_(go.TextBlock, { margin: 3 },
                            new go.Binding("text", "category"))
                    )
                )
        }
    )
);

processModelDiagram.nodeTemplateMap.add("Join",
    $_(go.Node, "Auto",
        nodeStyle(),
        $_(go.Panel, "Auto",
            getShape("Diamond", "#ffd8c4", "#524d10"),
            // getShape("SquareIBeam", "#000000", "#000000", 1, new go.Size(12, 12))
            getShape("Rectangle", "#000000", "#000000", 1, new go.Size(12, 12))
        ),
        port1(), port2(), port3(), port4(),
        getSelectionAdornmentTemplate(),
        {
            toolTip:
                $_(go.Adornment, "Auto",
                    $_(go.Shape, { fill: "lightyellow" }),
                    $_(go.Panel, "Vertical",
                        $_(go.TextBlock, { margin: 3 },
                            new go.Binding("text", "category"))
                    )
                )
        }
    )
);

processModelDiagram.nodeTemplateMap.add("Wait",
    $_(go.Node, "Auto", waitNodeStyle(),
        $_(go.Panel, "Auto",
            getShape("Rectangle", "#beddf2", "#524d10"),
            $_(go.Panel, "Vertical",
                $_(go.Panel, "Horizontal",
                    getShape("Rectangle", "#000000", "#524d10", 1, new go.Size(4, 12)),
                    getShape("Rectangle", "#000000", "#524d10", 1, new go.Size(4, 12))

                ),
                getTextBlock()
            ),
        ),
        port1(), port2(), port3(), port4(),
        getSelectionAdornmentTemplate(),
        {
            toolTip:
                $_(go.Adornment, "Auto",
                    $_(go.Shape, { fill: "lightyellow" }),
                    $_(go.Panel, "Vertical",
                        $_(go.TextBlock, { margin: 3 },
                            new go.Binding("text", "category"))
                    )
                )
        }
    )
);

processModelDiagram.nodeTemplateMap.add("End",
    $_(go.Node, "Auto",
        nodeStyle(),
        $_(go.Panel, "Auto",
            getShape("Circle", "#a3e1d4", "#524d10"),
            getShape("Circle", "#ff5a5a", "#000000", 2, new go.Size(16, 16)),
        ),
        port1(), port2(), port3(), port4(),
        getSelectionAdornmentTemplate(),
        {
            toolTip:
                $_(go.Adornment, "Auto",
                    $_(go.Shape, { fill: "lightyellow" }),
                    $_(go.Panel, "Vertical",
                        $_(go.TextBlock, { margin: 3 },
                            new go.Binding("text", "category"))
                    )
                )
        }
    )
);

var processModelPallette =
    $_(go.Palette, "processModellerPalletteDiv",
        {
            scrollsPageOnFocus: false,
            nodeTemplateMap: processModelDiagram.nodeTemplateMap,
            model: new go.GraphLinksModel(
                [
                    { category: "Start", text: "Start" },
                    { category: "Task", text: "Task" },
                    { category: "XOR", text: "XOR" },
                    { category: "Fork", text: "Fork" },
                    { category: "Join", text: "Join" },
                    { category: "Wait", text: "Wait" },
                    { category: "End", text: "End" }
                ]
            )
        }
    );
ProcessModeller.showPorts = false;
ProcessModeller.togglePorts = function () {
    ProcessModeller.showPorts = !ProcessModeller.showPorts;
    if (ProcessModeller.showPorts) {
        $("#btnTogglePorts").removeClass("bi bi-toggle-off");
        $("#btnTogglePorts").addClass("bi bi-toggle-on");
    }
    else {
        $("#btnTogglePorts").removeClass("bi bi-toggle-on");
        $("#btnTogglePorts").addClass("bi bi-toggle-off");
    }
    ProcessModeller.togglePortsInternal(ProcessModeller.showPorts);
}

ProcessModeller.togglePortsInternal = function (flag) {
    processModelDiagram.nodes.each(
        function (item) {
            ProcessModeller.toggleIndividualPort(item.part, flag);
        }
    );
}

ProcessModeller.toggleIndividualPort = function (e, flag) {
    e.part.findObject("T").visible = flag;
    e.part.findObject("L").visible = flag;
    e.part.findObject("R").visible = flag;
    e.part.findObject("B").visible = flag;
}

// ProcessModeller.saveProcessModel = function () {

//     let processData = getModelDiagram();
//     // Create a Blob with the text content
//     const blob = new Blob([processData], { type: 'text/plain' });

//     // Create a link element to download the Blob
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = 'processModelData.txt';

//     // Programmatically click the link to trigger the download
//     link.click();

//     // Clean up by revoking the URL object
//     URL.revokeObjectURL(link.href);

//     // Clear the diagram
//     processModelDiagram.clear();
// }


// Function to upload JSON data and load it into the diagram
ProcessModeller.uploadProcessData = function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const jsonData = e.target.result;
        // processModelDiagram.model = go.Model.fromJson(jsonData);
        processModelDiagram.model = loadModelDiagram(JSON.parse(jsonData));
    };
    reader.readAsText(file);
};

// Function to simulate a file input click for the upload button
ProcessModeller.triggerFileInput = function () {
    document.getElementById("uploadInput").click();
};

function makePort(name, align) {
    return $_(go.Shape, "Circle",
        {
            fill: "#CECECE",
            strokeWidth: 2,
            stroke: "#CECECE",
            width: 4,
            height: 4,
            alignment: align,
            portId: name,
            name: name,
            fromLinkable: true,
            toLinkable: true,
            cursor: "crosshair",
            visible: false,
            toLinkableSelfNode: true,
            fromLinkableSelfNode: true
        });
}

function port1() {
    return makePort("T", go.Spot.Top);
}

function port2() {
    return makePort("L", go.Spot.Left);
}

function port3() {
    return makePort("R", go.Spot.Right);
}

function port4() {
    return makePort("B", go.Spot.Bottom);
}

function getShape(shapeName, fill, stroke, strokeWidth, size) {
    var shape;
    var _stroke = 2;
    if (strokeWidth) {
        _stroke = strokeWidth;
    }
    if (size) {
        shape =
            $_(go.Shape, shapeName,
                {
                    fill: fill,
                    stroke: stroke,
                    strokeWidth: _stroke,
                    desiredSize: size,
                    margin: 1
                }
            );
    }
    else {
        shape =
            $_(go.Shape, shapeName,
                {
                    fill: fill,
                    stroke: stroke,
                    strokeWidth: _stroke
                }
            );
    }

    return shape;
}

function getTextBlock() {
    var tb =
        $_(go.TextBlock, textStyle(),
            {
                margin: 8,
                maxSize: new go.Size(160, NaN),
                wrap: go.TextBlock.WrapFit,
                textAlign: "center",
                editable: true
            },
            new go.Binding("text").makeTwoWay()
        );

    return tb;
}

function nodeStyle(resizable) {
    if (resizable == undefined) {
        resizable = false;
    }
    return [
        new go.Binding("location", "location", go.Point.parse).makeTwoWay(go.Point.stringify),
        new go.Binding("desiredSize", "desiredSize", go.Size.parse).makeTwoWay(go.Size.stringify),
        new go.Binding("key", "nodeId").makeTwoWay(),
        {
            locationSpot: go.Spot.Center,
            resizable: resizable,
            desiredSize: new go.Size(44, 44)

        }
    ];
}

function waitNodeStyle() {
    return [
        new go.Binding("location", "location", go.Point.parse).makeTwoWay(go.Point.stringify),
        new go.Binding("desiredSize", "desiredSize", go.Size.parse).makeTwoWay(go.Size.stringify),
        new go.Binding("key", "nodeId").makeTwoWay(),
        {
            locationSpot: go.Spot.Center,
            resizable: true,
            desiredSize: new go.Size(52, 52)

        }
    ];
}

function getSelectionAdornmentTemplate() {
    var sat =
    {
        selectionAdornmentTemplate:
            $_(go.Adornment, "Auto",
                $_(go.Shape, "Rectangle",
                    { fill: null, stroke: "#CECECE", strokeWidth: 2 }),
                $_(go.Placeholder)
            )
    }

    return sat;

}

function textStyle() {
    return {
        font: "bold 8pt 'open sans'"
    }
}

processModelDiagram.linkTemplate =
    $_(go.Link,
        {
            routing: go.Link.Orthogonal,
            curve: go.Link.JumpOver,
            corner: 10, toShortLength: 8,
            relinkableFrom: true,
            relinkableTo: true,
            reshapable: true,
            resegmentable: true,
            mouseEnter: function (e, link) { link.findObject("HIGHLIGHT").stroke = "rgba(206,206,206,0.9)"; },
            mouseLeave: function (e, link) { link.findObject("HIGHLIGHT").stroke = "transparent"; }
        },
        new go.Binding("points").makeTwoWay(),
        $_(go.Shape,
            { isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT" }),
        $_(go.Shape,
            { isPanelMain: true, stroke: "gray", strokeWidth: 2 }),
        $_(go.Shape,
            { toArrow: "standard", strokeWidth: 0, fill: "gray" }),
        $_(go.Panel, "Auto",
            { name: "LABEL", segmentIndex: 2, segmentFraction: 0.5 },
            $_(go.Shape, "Border",
                { fill: "#dde3e6", strokeWidth: 0 }),
            $_(go.TextBlock, "Transition",
                {
                    textAlign: "center",
                    font: "normal 10pt 'open sans'",
                    stroke: "#2c2c2c",
                    editable: true,
                    margin: 6
                },
                new go.Binding("text").makeTwoWay())
        )
    );

processModelDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
processModelDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;