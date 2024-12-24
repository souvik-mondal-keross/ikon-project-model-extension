(function () {
    const vscode = acquireVsCodeApi();

    // Load content
    window.addEventListener('message', (event) => {
        const message = event.data;
        if (message.type === 'update') {
            
            const parsedGraphObj = JSON.parse(message.text);
            loadModelDiagram(parsedGraphObj);
        }
        else if(message.type === 'theme_update') {
            console.log('theme updated');
        } 
    });

    function saveProcessModel () {
    
        const currentModelDiagram = getModelDiagram();
    
        vscode.postMessage({
            command: 'update',
            text: currentModelDiagram,
        });
    }

    // Detect "Ctrl+S" or "Cmd+S" and trigger save
    window.addEventListener('keydown', (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            event.preventDefault(); // Prevent default browser save
            saveProcessModel(); // Trigger save logic
        }
    });

    // Also send data before the WebView unloads
    window.addEventListener('beforeunload', () => {
        saveProcessModel();
    });


    setOnChangeCallback((currentModelDiagram) => {

        vscode.postMessage({
            command: 'modified',
            text: currentModelDiagram,
        });

    })

    setOnSaveBtnCallback(() => {
        saveProcessModel()
    })

})();
