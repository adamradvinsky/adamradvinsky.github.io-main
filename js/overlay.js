document.addEventListener("DOMContentLoaded", () => {

    const image = document.getElementById("roomImage");
    const canvas = document.getElementById("overlay");
    const ctx = canvas.getContext("2d");
    const debugBtn = document.getElementById("debugBtn");

    let debugMode = false;
    let currentPolygon = [];
    let regions = [
        {
            "name": "monitor",
            "points": [
                { "x": 0.3848629999809124, "y": 0.5584415584415584 },
                { "x": 0.38733518786719173, "y": 0.6844155844155844 },
                { "x": 0.5875824066558196, "y": 0.6831168831168831 },
                { "x": 0.5801658429969816, "y": 0.5558441558441558 }],
            onClick: () => {
                console.log("monitor clicked!");
                // do whatever you want here
            }


        },

        {
            "name": "Region 1",
            "points": [{ "x": 0.828620725568057, "y": 0.07922077922077922 },
            { "x": 0.8236763497954983, "y": 0.12467532467532468 },
            { "x": 0.8298568195111967, "y": 0.23896103896103896 },
            { "x": 0.8125515043072412, "y": 0.3220779220779221 },
            { "x": 0.836037289226895, "y": 0.33896103896103896 },
            { "x": 0.8471621347151521, "y": 0.3077922077922078 },
            { "x": 0.8471621347151521, "y": 0.36363636363636365 },
            { "x": 0.8644674499191076, "y": 0.36233766233766235 },
            { "x": 0.8718840135779458, "y": 0.3207792207792208 },
            { "x": 0.901550268213298, "y": 0.2883116883116883 },
            { "x": 0.8842449530093426, "y": 0.1012987012987013 },
            { "x": 0.8595230741465489, "y": 0.053246753246753244 }],
            onClick: () => {
                console.log("medals clicked!");
                openPopupMedals();
            }
        }




    ];
    let hoveredRegion = null;

    console.log("debugBtn found:", debugBtn);

    /* ----------------------------
       RESIZE HANDLING
    ---------------------------- */
    function resizeCanvas() {
        canvas.width = image.clientWidth;
        canvas.height = image.clientHeight;
    }

    if (image.complete) {
        resizeCanvas();
        draw();
    } else {
        image.addEventListener("load", () => {
            resizeCanvas();
            draw();
        });
    }

    window.addEventListener("resize", () => {
        resizeCanvas();
        draw();
    });

    /* ----------------------------
       DEBUG TOGGLE
    ---------------------------- */
    debugBtn.addEventListener("click", () => {
        debugMode = !debugMode;
        canvas.style.pointerEvents = debugMode ? "auto" : "none";
        console.log("Debug mode:", debugMode);
    });

    /* ----------------------------
       MOUSE POSITION
    ---------------------------- */
    function getMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    /* ----------------------------
       POINT IN POLYGON (ray casting)
    ---------------------------- */
    function pointInPolygon(x, y, poly) {
        let inside = false;

        const points = poly.map(p => ({
            x: p.x * canvas.width,
            y: p.y * canvas.height
        }));

        for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
            const xi = points[i].x, yi = points[i].y;
            const xj = points[j].x, yj = points[j].y;

            const intersect = ((yi > y) !== (yj > y)) &&
                (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

            if (intersect) inside = !inside;
        }

        return inside;
    }

    /* ----------------------------
       MOUSE MOVE (HOVER DETECT)
    ---------------------------- */
    document.getElementById("roomContainer").addEventListener("mousemove", (e) => {
        if (debugMode) return;

        const { x, y } = getMousePos(e);
        hoveredRegion = null;

        for (const region of regions) {
            if (pointInPolygon(x, y, region.points)) {
                hoveredRegion = region;
                break;
            }
        }

        draw();
    });

    /* ----------------------------
       CLICK (DEBUG DRAW MODE)
    ---------------------------- */
    canvas.addEventListener("click", (e) => {
        const { x, y } = getMousePos(e);

        if (debugMode) {
            currentPolygon.push({
                x: x / canvas.width,
                y: y / canvas.height
            });
            console.log("Point added:", x / canvas.width, y / canvas.height);
            draw();
            return;
        }

        for (const region of regions) {
            if (pointInPolygon(x, y, region.points)) {
                if (region.onClick) region.onClick();
                break;
            }
        }
    });

    /* ----------------------------
       SAVE REGION (ENTER KEY)
    ---------------------------- */
    document.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && debugMode) {
            if (currentPolygon.length < 3) {
                console.warn("Need at least 3 points to save a region");
                return;
            }

            regions.push({
                name: "Region " + regions.length,
                points: [...currentPolygon]
            });

            console.log("Saved regions:", JSON.stringify(regions));

            currentPolygon = [];
            draw();
        }
    });

    /* ----------------------------
       DRAW EVERYTHING
    ---------------------------- */
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (const region of regions) {
            drawPolygon(region.points, "rgba(255, 255, 255, 0.08)", "rgba(255,255,255,0.2)", true, false);
        }
        if (hoveredRegion) {
            drawPolygon(hoveredRegion.points, "rgba(255, 255, 255, 0.18)", "rgba(255,255,255,0.5)", true, false);
        }

        if (currentPolygon.length > 0) {
            drawPolygon(currentPolygon, "rgba(255,255,255,0.1)", "white", true);
        }
    }

    /* ----------------------------
       DRAW POLYGON
    ---------------------------- */
    function drawPolygon(points, fill, stroke, normalized = false, showDots = true) {

        if (points.length === 0) return;

        const scale = (p) => ({
            x: normalized ? p.x * canvas.width : p.x,
            y: normalized ? p.y * canvas.height : p.y
        });

        ctx.beginPath();
        const start = scale(points[0]);
        ctx.moveTo(start.x, start.y);

        for (let i = 1; i < points.length; i++) {
            const pt = scale(points[i]);
            ctx.lineTo(pt.x, pt.y);
        }

        ctx.closePath();

        if (fill) {
            ctx.fillStyle = fill;
            ctx.fill();
        }

        ctx.strokeStyle = stroke;
        ctx.lineWidth = 2;
        ctx.stroke();

        if (showDots) {
            for (const p of points) {
                const pt = scale(p);
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
                ctx.fillStyle = "white";
                ctx.fill();
            }
        }
    }

}); // end DOMContentLoaded