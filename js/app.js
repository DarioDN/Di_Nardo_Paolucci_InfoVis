$.fn.selectpicker.Constructor.BootstrapVersion = '4';

var championsDict = {};

var avgStatsDictOtherPlayers = {};

var avgStatsArrayOtherPlayers = [];

var avgStatsDict = {};

var avgStatsArray = [];

var champions;

var tooltip;

var globalData;

var data1 = [];

var stats = [];

var summonerName;

var delayTime = 1000;
var updateTime = 500;

var margin = {top: 30, right: 30, bottom: 70, left: 90};
var margin2 = {top: 425, right: 30, bottom: 0, left: 90};
var width = 1000 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;
var height2 = 600 - margin2.top - margin2.bottom;

var x = d3.scaleBand()
    .range([0, width])
    .padding(0.1);

// var xAVG = d3.scaleBand()
//     .range([0, width])
//     .padding(0.1);

var x2 = d3.scaleBand()
    .range([0, width])
    .padding(0.2);

var y = d3.scaleLinear().range([height, 0]);
var y2 = d3.scaleLinear().range([height, 0]);

var xAxis = d3.axisBottom().scale(x);
// var xAVGAxis = d3.axisBottom().scale(xAVG);
var xAxis2 = d3.axisBottom().scale(x2);
var yAxis = d3.axisLeft().scale(y);

x.domain(data1.map(function(d) { return d.gameCreation}));
// xAVG.domain(data1.map(function(d) { return d.gameCreation}));
y.domain([0, d3.max(data1, function(d) { return parseInt(d.value); })]);
x2.domain(data1.map(function(d) { return d.gameCreation}));
y2.domain([0, d3.max(data1, function(d) { return parseInt(d.value); })]);

var brush = d3.brushX().extent([[0,0],[width,height]]).on("brush",brushed).on("end",brushed);

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom +500);

var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

focus.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

focus.append("g")
    .attr("class", "y axis")
    .call(yAxis);

//TODO
// function updateXScaleDomain(data) {
//     x.domain(data.map(function(d) { return d.group}));
//     // for example x.domain is initialized with ["0-4", "5-9", "10-14", ... ]
// }
//TODO
// function updateYScaleDomain(data){
//     y.domain([0, d3.max(data, function(d) { return parseInt(d.value); })]);
// }

//TODO
// function updateAxes(){
//     // ".y.axis" selects elements that have both classes "y" and "axis", that is: class="y axis"
//     svg.select(".y.axis").transition().duration(updateTime).call(yAxis);
//     svg.select(".x.axis").transition().duration(updateTime).call(xAxis)
//         .selectAll("text")
//         .style("font-weight","bold")
//         .attr("transform", "translate(-50,40) rotate(-35)");
// }

//TODO
// function drawAxes(){
//
//     // draw the x-axis
//     //
//     svg.append("g")
//         .attr("class", "x axis")
//         .attr("transform", "translate(0," + height + ")")
//         .call(xAxis);
//     // draw the y-axis
//     //
//     svg.append("g")
//         .attr("class", "y axis")
//         .call(yAxis);
//
//     // add a label along the y-axis
//     //
//     // svg.append("text")
//     //     .attr("transform", "rotate(-90)")
//     //     .attr("y", 15)
//     //     .attr("font-size","15px")
//     //     .style("text-anchor", "end")
//     //     .text("Population (thousands)");
// }

//TODO
// Parameter data is the object containing the values for a specific year
// it has two fields: data.year (a number) and data.ageGroups (an array).
// Each element d of data.ageGroups[] has d.ageGroup (for example "0-4") and
// d.population (a number)
//
// function updateDrawing(data){
//
//     var values = data;
//
//     // Data join: function(d) is the key to recognize the right bar
//     var bars = svg.selectAll(".bar").data(values, function(d){return d.value});
//
//     // Exit clause: Remove elements
//     bars.exit().remove();
//
//     // Enter clause: add new elements
//     bars.enter().append("rect")
//         .attr("class", "bar")
//         .attr("x", function(d) { return x(d.group); })
//         .attr("y", function(d) { return y(d.value); })
//         .attr("width", x.bandwidth())
//         .attr("height", function(d) { return height - y(d.value); })
//         .attr("kills", function(d) { return d.kills.toString(); })
//         .attr("deaths", function(d) { return d.deaths.toString(); })
//         .attr("assists", function(d) { return d.assists.toString(); })
//         .attr("index", function(d) { return d.index.toString(); })
//         .attr("matchId", function(d) { return d.matchId.toString(); })
//         .attr("fill", function(d) { if (d.win === "true") return "#0073ff"
//             if(d.win === "false") return "#ff0000"})
//         .attr("onclick", function(d) { return "showMatch(globalData["+d.index+"])"})
//         .attr("onmouseover", function(d) { return "showTooltip(globalData["+d.index+"])"});
//
//     // Enter + Update clause: update y and height
//     //
//     bars.transition().duration(updateTime)
//         .attr("x", function(d) { return x(d.group); })
//         .attr("y", function(d) { return y(d.value); })
//         .attr("width", x.bandwidth())
//         .attr("height", function(d) { return height - y(d.value); });
//
//     // Data join for year
//     // ".year" selects all elements with class="year"
//     //
//     // var yearNode = svg.selectAll(".year").data([0,2]);
//     //
//     // // Omitting the exit clause
//     //
//     // // Enter year
//     // //
//     // yearNode.enter().append("text")
//     //     .attr("class","year")
//     //     .attr("x", width - margin.right)
//     //     .attr("y", margin.top);
//     //
//     // // Enter + Update year
//     // //
//     // yearNode.text(function(d){ return d });
//
//     tooltip = d3.select("body").append("div")
//         .attr("id", "myTooltip")
//         .style("opacity", 0);
//
//     // d3.selectAll('.bar').on("mouseover",function() {
//     //     // d3.select(this).style("fill","#000000");
//     //
//     //     tooltip.append()
//     //         .transition()
//     //         .duration(200)
//     //         .style("opacity", "1");
//     // });
//
//     d3.selectAll('.bar').on("mouseout",function() {
//         // tooltip.style("display", "none");
//         tooltip
//             .transition()
//             .duration(200)
//             .style("opacity", "0");
//
//     });
//
//     d3.selectAll('.bar').on("mousemove",function() {
//         tooltip.style("left", (d3.event.pageX +0) + "px")
//             .style("top", (d3.event.pageY -10) + "px");
//
//     });
//
//
//     $(document).ready(function() {
//         $('.selectpicker').selectpicker();
//         // $("#championSelect").selectpicker('selectAll');
//     });
//
// }

//TODO
// function redraw(data) {
//     updateXScaleDomain(data);
//     updateYScaleDomain(data);
//     updateAxes();
//     updateDrawing(data);
// }

function start() {

    d3.json("data/dataset.json")
        .then(function(data) {
            globalData = data;
            games = data;
            AVGgames = data;

            globalData = games;
            for (let i = 0; i < games.length; i++) {

                if (games[i]["boh"][0]["summonerName"] === "our wave") {
                    document.getElementById("summonerName").innerHTML = summonerName = games[i]["boh"][0]["summonerName"];
                    data1.push({
                        group: new Date(parseInt(games[i]["boh"][0]["gameCreation"])).toLocaleString(),
                        value: parseInt(games[i]["boh"][0]["goldSpent"]),
                        win: games[i]["boh"][0]["win"],
                        matchId: games[i]["_id"],
                        kills: games[i]["boh"][0]["kills"],
                        deaths: games[i]["boh"][0]["deaths"],
                        assists: games[i]["boh"][0]["assists"],
                        totalMinionsKilled: games[i]["boh"][0]["totalMinionsKilled"],
                        totalDamageDealt: games[i]["boh"][0]["totalDamageDealt"],
                        minutes: games[i]["boh"][1]["frames"].length,
                        championId: games[i]["boh"][0]["championId"],
                        role: games[i]["boh"][0]["role"],
                        gameCreation: parseInt(games[i]["boh"][0]["gameCreation"]),
                        index: i
                    })
                }
            }
            // document.getElementById("summonerName").innerHTML = summonerName = games[0]["boh"][0]["summonerName"];
            // Initialize the plot with the first dataset
            // console.log(data1)
            // redraw(data1)
            data1.sort(sortByGameCreation);
            drawBrush(data1)
        })
        .catch(function(error) {
            console.log(error);
        })

    d3.json("data/avgStats.json")
        .then(function(avgData) {
            for (let i = 0; i<avgData.length;i++){
                avgStatsDict[avgData[i].gameId] = avgData[i];
                avgStatsArray.push(avgData[i])
            }
        })
        .catch(function(error) {
            console.log(error);
        })

    d3.json("data/avgStatsOtherPlayers.json")
        .then(function(avgDataOtherPlayers) {
            var min = 1594803620502//d3.min(avgDataOtherPlayers, function(d) { return parseInt(d.gameCreation); });
            var max = 1595595740585// d3.max(avgDataOtherPlayers, function(d) { return parseInt(d.gameCreation); });

            var object = null;
            for (let i = 0; i<avgDataOtherPlayers.length;i++){
                object = avgDataOtherPlayers[i].gameCreation = Math.floor(Math.random()*(max-min)+min);
                avgStatsDictOtherPlayers[avgDataOtherPlayers[i].gameId] = object;
                avgStatsArrayOtherPlayers.push(avgDataOtherPlayers[i])

            }
        })
        .catch(function(error) {
            console.log(error);
        })
}

function sortByGameCreation(a,b) {
    if (parseInt(a.gameCreation) > parseInt(b.gameCreation))
        return 1;
    if (parseInt(a.gameCreation) < parseInt(b.gameCreation))
        return -1;
    return 0;
}

function drawBrush(data) {
    x.domain(data.map(function(d) { return d.gameCreation}));
    y.domain([0, d3.max(data, function(d) { return parseInt(d.value); })]);
    x2.domain(data.map(function(d) { return d.gameCreation}));
    y2.domain([0, d3.max(data, function(d) { return parseInt(d.value); })]);

    xAxis = d3.axisBottom().scale(x);

    avgPlayer(data);
    enter(data);
    updateScale(data);
    avgAllPlayers(data);

    focus.select(".x.axis").call(xAxis)
        .selectAll("text")
        .text(function(d){
            return new Date(parseInt(d)).toLocaleString();})
        .style("font-weight","bold")
        .attr("transform", "translate(-50,40) rotate(-35)");

    var subBars = context.selectAll('.subBar')
        .data(data)

    var maxHeight = d3.max(data, function(d) { return parseInt(y2(d.value)); })
    subBars.enter().append("rect")
        .classed('subBar', true)
        .attr("height",function(d) { return (height2-(y2(d.value)/maxHeight)*100) ; })//height2 - y2(d.value)
        .attr("width",function() { return x2.bandwidth(); })
        .attr("x",function(d) { //console.log(x(d.group))
            return x2(d.gameCreation); })//x2(d.group)
        .attr("y",function(d) { //console.log(y2(d.value))
            return (y2(d.value)/maxHeight)*100; }) //y2(d.value)
        .attr("fill", function(d) {//console.log(d.win)
            //console.log(d.win === "true")
            if (d.win === "true") return "#0073ff"
            else return "#ff0000"});

    context.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height2) + ")")
        .call(xAxis2)
        .selectAll(".tick").remove();

    context.append("g")
        .attr("class", "x brush")
        .call(brush)
        .selectAll("rect")
        .attr("y", -6)
        .attr("height", height2 + 7);

    tooltip = d3.select("body").append("div")
        .attr("id", "myTooltip")
        .style("opacity", 0);

    d3.selectAll('.bar').on("mouseover",function() {
        // d3.select(this).style("fill","#000000");

        tooltip.append()
            .transition()
            .duration(200)
            .style("opacity", "1");
    });

    d3.selectAll('.bar').on("mouseout",function() {
        // tooltip.style("display", "none");
        tooltip
            .transition()
            .duration(200)
            .style("opacity", "0");

    });

    d3.selectAll('.bar').on("mousemove",function() {
        tooltip.style("left", (d3.event.pageX +0) + "px")
            .style("top", (d3.event.pageY -10) + "px");

    });
}

function brushed() {
    var data = data1;
    var selection = d3.brushSelection(this);//d3.event.selection;

    if (selection !== null) {

        var selected = x2.domain()
            .filter(function (d) {
                return (selection[0] <= x2(d)) && (x2(d) <= selection[1]);
            });

        var updatedData = [];
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < selected.length; j++) {
                if (data[i].gameCreation === selected[j])
                    updatedData.push(data[i]);
            }
        }

        if(updatedData.length!==0) {

            avgPlayer(updatedData);
            update(updatedData);
            enter(updatedData);
            updateScale(updatedData);
            avgAllPlayers(updatedData);

        }
    } else {

        avgPlayer(data);
        update(data);
        enter(data);
        updateScale(data);
        avgAllPlayers(data);

    }

}

function updateScale(data) {
    var tickScale = d3.scalePow().range([data.length / 10, 0]).domain([data.length, 0]).exponent(.5)

    // var selection = d3.event.selection;
    var brushValue = brush.extent()[1] - brush.extent()[0];//selection[1] - selection[0];//
    if(brushValue === 0) {
        brushValue = width;
    }

    var tickValueMultiplier = Math.ceil(Math.abs(tickScale(brushValue)));
    var filteredTickValues = data.filter(function(d, i){return i % tickValueMultiplier === 0}).map(function(d){ return d.group})

    filteredTickValues = [];

    for (let i = 0; i<data.length; i++) {
        filteredTickValues.push(data[i].gameCreation);
    }

    focus.select(".x.axis").call(xAxis.tickValues(filteredTickValues))
        .selectAll("text")
        .text(function (d) {
            return new Date(parseInt(d)).toLocaleString()
        })
        .style("font-weight","bold")
        .attr("transform", "translate(-50,40) rotate(-35)");
    focus.select(".y.axis").call(yAxis);
}

function update(data) {
    x.domain(data.map(function(d){ return d.gameCreation}));
    y.domain([0, d3.max(data, function(d) { return d.value;})]);

    removeAvgBars()
    removeBars();
    var bars =  focus.selectAll('.avgBar')
        .data(data)
        .enter()

    bars.append("rect")
        .classed('avgBar', true)
        .attr("height", function (d) {
            var matchId = d.matchId.split("_")[0]
            if(avgStatsDict[matchId]!==undefined)
                var boh = avgStatsDict[matchId].goldSpent;
            // console.log(y(boh))
            return height - y(boh)})
        .attr("width", function () { return x.bandwidth(); })
        .attr("x", function (d) { return x(d.gameCreation); })
        .attr("y", function (d) {
            var matchId = d.matchId.split("_")[0]
            if(avgStatsDict[matchId]!==undefined)
                var boh = avgStatsDict[matchId].goldSpent;
            // console.log(y(boh))
            return y(boh); })
        // .attr("deaths", function(d) { return d.deaths.toString(); })
        // .attr("assists", function(d) { return d.assists.toString(); })
        // .attr("index", function(d) { return d.index.toString(); })
        // .attr("matchId", function(d) { return d.matchId.toString(); })
        .attr("fill", function(d) {//console.log(d.win)
            // console.log(d.win === "true")
            if (d.win === "true") return "rgba(0,0,0,0.11)"
            else return "rgba(0,0,0,0.18)"})
    // .attr("onclick", function(d) { return "showMatch(globalData["+d.index+"])"})
    // .attr("onmouseover", function(d) { return "showTooltip(globalData["+d.index+"])"});

    var bars =  focus.selectAll('.bar')
        .data(data)
    bars.attr("height", function (d) { return height - y(d.value); })
        .attr("width", function () { return x.bandwidth()*0.8; })
        .attr("x", function (d) { return x(d.gameCreation)+x.bandwidth()/10; })
        .attr("y", function (d) { return y(d.value); })
        .attr("deaths", function(d) { return d.deaths.toString(); })
        .attr("assists", function(d) { return d.assists.toString(); })
        .attr("index", function(d) { return d.index.toString(); })
        .attr("matchId", function(d) { return d.matchId.toString(); })
        .attr("fill", function(d) {//console.log(d.win)
            // console.log(d.win === "true")
            if (d.win === "true") return "#0073ff"
            else return "#ff0000"})
        .attr("onclick", function(d) { return "showMatch(globalData["+d.index+"])"})
        .attr("onmouseover", function(d) { return "showTooltip(globalData["+d.index+"])"});

    // var u = focus.selectAll(".lineTest")
    //     .data(data);
    //
    // // Updata the line
    // u
    //     .enter()
    //     .append("path")
    //     .attr("class","lineTest")
    //     .merge(u)
    //     .attr("d", d3.line()
    //         .x(function(d) { return x(d.gameCreation)+x.bandwidth()/10; })
    //         .y(function(d) { return y(d.value); }))
    //     .attr("fill", "darkblue")
    //     .attr("stroke", "steelblue")
    //     .attr("stroke-width", 2.5)

}

function exit(data) {
    console.log(data)
    var bars =  focus.selectAll('.bar').data(data)
    bars.exit().remove()

    var bars =  focus.selectAll('.avgBar').data(data)
    bars.exit().remove()
}


function removeBars() {
    var bars =  focus.selectAll('.bar')
    bars.remove()
}
function removeLines() {
    var lines =  focus.selectAll('.line')
    lines.remove()
}


function removeAvgBars() {
    var bars =  focus.selectAll('.avgBar')
    bars.remove()
}

function enter(data) {
    x.domain(data.map(function(d){ return d.gameCreation}));
    y.domain([0, d3.max(data, function(d) { return d.value;})]);

    removeAvgBars()
    removeBars()
    var bars =  focus.selectAll('.bar')
        .data(data)
        .enter()//.append("g")

        bars.append("rect")
        .classed('bar', true)
        .attr("height", function (d) { return height - y(d.value); })
        .attr("width", function () { return x.bandwidth()*0.8; })
        .attr("x", function (d) { return x(d.gameCreation)+x.bandwidth()/10; })
        .attr("y", function (d) { return y(d.value); })
        .attr("deaths", function(d) { return d.deaths.toString(); })
        .attr("assists", function(d) { return d.assists.toString(); })
        .attr("index", function(d) { return d.index.toString(); })
        .attr("matchId", function(d) { return d.matchId.toString(); })
        .attr("fill", function(d) {//console.log(d.win)
            // console.log(d.win === "true")
            if (d.win === "true") return "#0073ff"
            else return "#ff0000"})
        .attr("onclick", function(d) { return "showMatch(globalData["+d.index+"])"})
        .attr("onmouseover", function(d) { return "showTooltip(globalData["+d.index+"])"})

    var bars =  focus.selectAll('.avgBar')
        .data(data)
        .enter()

            bars.append("rect")
        .classed('avgBar', true)
        .attr("height", function (d) {
            var matchId = d.matchId.split("_")[0]
            if(avgStatsDict[matchId]!==undefined)
            var boh = avgStatsDict[matchId].goldSpent;
            // console.log(y(boh))
            return height - y(boh)})
        .attr("width", function () { return x.bandwidth(); })
        .attr("x", function (d) { return x(d.gameCreation); })
        .attr("y", function (d) {
            var matchId = d.matchId.split("_")[0]
            if(avgStatsDict[matchId]!==undefined)
                var boh = avgStatsDict[matchId].goldSpent;
            // console.log(y(boh))
            return y(boh); })
        // .attr("deaths", function(d) { return d.deaths.toString(); })
        // .attr("assists", function(d) { return d.assists.toString(); })
        // .attr("index", function(d) { return d.index.toString(); })
        // .attr("matchId", function(d) { return d.matchId.toString(); })
        .attr("fill", function(d) {//console.log(d.win)
            // console.log(d.win === "true")
            if (d.win === "true") return "rgba(0,0,0,0.11)"
            else return "rgba(0,0,0,0.18)"})
        // .attr("onclick", function(d) { return "showMatch(globalData["+d.index+"])"})
        // .attr("onmouseover", function(d) { return "showTooltip(globalData["+d.index+"])"});



}

function avgPlayer (data) {

    var sum = 0;
    var counter = 0;
    for (let i = 0; i<data.length; i++) {
        sum = sum + data[i].value;
        counter++;
    }
    var avg = sum/counter;
    console.log(data)
    focus.select('#AVGPlayerLine').remove()
    focus.append("line")
        .attr("class", "line")
        .attr("x1","1")
        .attr("y1",function() { return y(avg); })
        .attr("x2","878")
        .attr("y2",function() { return y(avg); })
        .attr("stroke","black")
        .attr("stroke-width","5")
        .attr("id","AVGPlayerLine");
}

function avgAllPlayers(data) {
    var min = d3.min(data, function(d) { return parseInt(d.gameCreation); });
    var max = d3.max(data, function(d) { return parseInt(d.gameCreation); });
    var diff = max-min;
    var ymax = d3.max(data, function(d) { console.log(d.value)
        return parseInt(d.value); });

    var dataset = avgStatsArrayOtherPlayers;
    var points = [];
    for (let i = 0; i<dataset.length; i++) {
        if(dataset[i].gameCreation >= data[0].gameCreation && dataset[i].gameCreation <= data[data.length-1].gameCreation) {
            points.push({
                x: dataset[i].gameCreation,
                y: dataset[i].goldSpent
            })
        }

    }

    points.sort(sortByXGameCreation)

    var line = d3.line()
        .x(function(d) { return ((d.x-min)/diff*800)}) // set the x values for the line generator
        .y(function(d) { return (d.y)/ymax*300; }) // set the y values for the line generator
        .curve(d3.curveMonotoneX)
    focus.select('#AVGOtherPlayersLine').remove()
    focus.append("path")
        .datum(points) // 10. Binds data to the line
        .attr("class", "line") // Assign a class for styling
        .attr("d", line)
        .attr("id","AVGOtherPlayersLine");
}

function sortByXGameCreation(a,b) {
    if (parseInt(a.x) > parseInt(b.x))
        return 1;
    if (parseInt(a.x) < parseInt(b.x))
        return -1;
    return 0;
}

$("#searchedSummonerNameForm").submit(function() {
    getDataBySummoner($("#searchedSummonerName").val());
    return false;
});

// function getDataBySummoner(searchedSummonerName) {
//     $.ajax({
//         url : '/kafka/getDataBySummoner',
//         data: {summoner: searchedSummonerName},
//         type : 'GET',
//         async : true,
//         complete : function(data) {
//             games = data.responseJSON.docs;
//             document.getElementById("summonerName").innerHTML = summonerName = data.responseJSON.docs[0]["boh"][0]["summonerName"].replaceAll("\"", "");
//             globalData = games;
//             for (let i = games.length-1; i>=0; i--) {
//                 if (data.responseJSON.docs[i]["boh"][0]["gameCreation"] !== undefined && data.responseJSON.docs[i]["boh"][0]["gameCreation"] !== null) {
//
//                     data1.push({
//                         group:new Date(parseInt(games[i]["boh"][0]["gameCreation"])).toLocaleString(),
//                         value:parseInt(games[i]["boh"][0]["goldSpent"]),
//                         win:games[i]["boh"][0]["win"],
//                         matchId: games[i]["_id"],
//                         kills: games[i]["boh"][0]["kills"],
//                         deaths: games[i]["boh"][0]["deaths"],
//                         assists: games[i]["boh"][0]["assists"],
//                         totalMinionsKilled: games[i]["boh"][0]["totalMinionsKilled"],
//                         totalDamageDealt: games[i]["boh"][0]["totalDamageDealt"],
//                         minutes: games[i]["boh"][1]["frames"].length,
//                         championId:games[i]["boh"][0]["championId"],
//                         role:games[i]["boh"][0]["role"],
//                         gameCreation:games[i]["boh"][0]["gameCreation"],
//                         index : i
//                     })
//
//                 }
//             } document.getElementById("summonerName").innerHTML = summonerName = data.responseJSON.docs[0]["boh"][0]["summonerName"].replaceAll("\"", "");
//             // Initialize the plot with the first dataset
//             // console.log(data1)
//             redraw(data1)
//         }
//     });
// }

// function updateData(dataName) {
//     data1 = []
//     for (let i = globalData.length-1; i >= 0; i--) {
//         if (globalData[i]["boh"][0]["gameCreation"] !== undefined && globalData[i]["boh"][0]["gameCreation"] !== null) {
//
//             data1.push({
//                 group: new Date(parseInt(globalData[i]["boh"][0]["gameCreation"])).toLocaleString(),
//                 value: parseInt(globalData[i]["boh"][0][dataName]),
//                 win: globalData[i]["boh"][0]["win"],
//                 matchId: games[i]["_id"],
//                 kills: globalData[i]["boh"][0]["kills"],
//                 deaths: globalData[i]["boh"][0]["deaths"],
//                 assists: globalData[i]["boh"][0]["assists"],
//                 totalMinionsKilled: globalData[i]["boh"][0]["totalMinionsKilled"],
//                 totalDamageDealt: globalData[i]["boh"][0]["totalDamageDealt"],
//                 minutes: globalData[i]["boh"][1]["frames"].length,
//                 championId:globalData[i]["boh"][0]["championId"],
//                 role:globalData[i]["boh"][0]["role"],
//                 gameCreation:globalData[i]["boh"][0]["gameCreation"],
//                 index:i
//             })
//         }
//     } redraw(data1);
// }

// $("#championSelect").selectpicker();
d3.json("http://ddragon.leagueoflegends.com/cdn/10.15.1/data/en_US/champion.json")
    .then(function(data) {
        var championsArray = Object.entries(data.data);
        for(let i = 0; i<championsArray.length;i++) {
            championsDict[championsArray[i][1].key] = championsArray[i][1];

        }
        champions = championsArray;
        // console.log(champions);
        for(let i = 0; i<champions.length;i++){
            $("#championSelect").append('<option value="'+i+'">'+champions[i][1].id+'</option>');
        }
        $("#championSelect").val("All");
        $("#championSelect").selectpicker("refresh");
    })
    .catch(function(error) {
        console.log(error);
    })

function showTooltip(data) {
    var kills = data["boh"][0].kills;
    var totalMinionsKilled = data["boh"][0].totalMinionsKilled;
    var minutes = data["boh"][1]["frames"].length -1;
    var deaths = data["boh"][0].deaths;
    var assists = data["boh"][0].assists;
    var kda = Math.round(((kills + assists)/deaths)*10)/10;
    var cs4minute = Math.round((totalMinionsKilled/minutes)*10)/10;
    tooltip
        .transition()
        .duration(200)
        .style("opacity", "1");
    tooltip
        .html("<div id='tooltipKDAText'><text id='KDAText'> KDA:"+ kda + "\n" +kills +"/"+ deaths +"/"+ assists + "</text></div>" +
            "<div id='tooltipChampImage'><img style='display: inline' width='60' height='60' src="+ "img/champion/" + championsDict[data["boh"][0].championId].image.full +" /></div>" +
            "<div id='tooltipRoleImage'><img style='display: inline' width='60' height='60' src="+ "img/ranked-positions/" + data["boh"][0].role +".png /></div>" +
            "<div id='tooltipCSText'><text id='CSText'> CS: " + totalMinionsKilled + "\n" +cs4minute +"/minute" + "</text></div>")
    // console.log(championsDict[data["boh"][0].championId].image.full);
}

function showMatch(data) {

    console.log(data);
    // d3.select('#championModalImage').remove()
    // d3.select('#championModalDiv').append("img")
    //     .attr("src","/resources/img/champion/" + championsDict[data["boh"][0].championId].image.full + "")
    //     .attr("id","championModalImage")
    //     .attr("width","120")
    //     .attr("height","120");
    //
    // // d3.select('#championModalDiv').append("img")
    //
    // $('#gameModal').modal('show')

}

// function toggleSelectAll(control) {
//     var allOptionIsSelected = (control.val() || []).indexOf("All") > -1;
//     function valuesOf(elements) {
//         return $.map(elements, function(element) {
//             return element.value;
//         });
//     }
//
//     if (control.data('allOptionIsSelected') != allOptionIsSelected) {
//         // User clicked 'All' option
//         if (allOptionIsSelected) {
//             // Can't use .selectpicker('selectAll') because multiple "change" events will be triggered
//             control.selectpicker('val', valuesOf(control.find('option')));
//         } else {
//             control.selectpicker('val', []);
//         }
//     } else {
//         // User clicked other option
//         if (allOptionIsSelected && control.val().length != control.find('option').length) {
//             // All options were selected, user deselected one option
//             // => unselect 'All' option
//             control.selectpicker('val', valuesOf(control.find('option:selected[value!=All]')));
//             allOptionIsSelected = false;
//         } else if (!allOptionIsSelected && control.val().length == control.find('option').length - 1) {
//             // Not all options were selected, user selected all options except 'All' option
//             // => select 'All' option too
//             control.selectpicker('val', valuesOf(control.find('option')));
//             allOptionIsSelected = true;
//         }
//     }
//     control.data('allOptionIsSelected', allOptionIsSelected);
// }
// $('#championSelect').selectpicker().change(function(){toggleSelectAll($(this));}).trigger('change');
$('#championSelect').on('change', function(){
    var thisObj = $(this);
    var isAllSelected = thisObj.find('option[value="All"]').prop('selected');
    var lastAllSelected = $(this).data('all');
    var selectedOptions = (thisObj.val())?thisObj.val():[];
    var allOptionsLength = thisObj.find('option[value!="All"]').length;

    var selectedOptionsLength = selectedOptions.length;

    if(isAllSelected == lastAllSelected){

        if($.inArray("All", selectedOptions) >= 0){
            selectedOptionsLength -= 1;
        }

        if(allOptionsLength <= selectedOptionsLength){

            thisObj.find('option[value="All"]').prop('selected', true).parent().selectpicker('refresh');
            isAllSelected = true;
        }else{
            thisObj.find('option[value="All"]').prop('selected', false).parent().selectpicker('refresh');
            isAllSelected = false;
        }

    }else{
        thisObj.find('option').prop('selected', isAllSelected).parent().selectpicker('refresh');
    }

    $(this).data('all', isAllSelected);
}).trigger('change');

// drawAxes();
////////////////////////////////////////////////////////////////////////////////////////////////
let dataRadar = [];
let features = ["A","B","C","D","E","F"];
//generate the data
for (var i = 0; i < 2; i++){
    var point = {}
    //each feature will be a random number from 1-9
    features.forEach(f => point[f] = 1 + Math.random() * 8);
    dataRadar.push(point);
}
// console.log(dataRadar);

var dim = 128;

let svgRadar = d3.select("#player_container").append("svg")
    .attr("id","svgRadar")
    .attr("width", dim*1.1)
    .attr("height", dim*1.1);


let radialScale = d3.scaleLinear()
    .domain([0,10])
    .range([0,dim/2]);

let ticks = [2,4,6,8,10];

ticks.forEach(t =>
    svgRadar.append("circle")
        .attr("cx", dim/2)
        .attr("cy", dim/2)
        .attr("fill", "none")
        .attr("stroke", "gray")
        .attr("r", radialScale(t))
);
//
// ticks.forEach(t =>
//     svgRadar.append("text")
//         .attr("x", (dim/2)+5)
//         .attr("y", dim/2 - radialScale(t))
//         .text(t.toString())
// );

function angleToCoordinate(angle, value){
    let x = Math.cos(angle) * radialScale(value);
    let y = Math.sin(angle) * radialScale(value);
    return {"x": dim/2 + x, "y": dim/2 - y};
}
for (var i = 0; i < features.length; i++) {
    let ft_name = features[i];
    let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
    let line_coordinate = angleToCoordinate(angle, 10);
    let label_coordinate = angleToCoordinate(angle, 10.5);

    //draw axis line
    svgRadar.append("line")
        .attr("x1", dim/2)
        .attr("y1", dim/2)
        .attr("x2", line_coordinate.x)
        .attr("y2", line_coordinate.y)
        .attr("stroke","black");

    //draw axis label
    // svgRadar.append("text")
    //     .attr("x", label_coordinate.x)
    //     .attr("y", label_coordinate.y)
    //     .text(ft_name);
}
let line = d3.line()
    .x(d => d.x)
    .y(d => d.y);
let colors = ["darkorange", "navy", "grey"];

function getPathCoordinates(data_point){
    let coordinates = [];
    for (var i = 0; i < features.length; i++){
        let ft_name = features[i];
        let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
        coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
    }
    return coordinates;
}
for (var i = 0; i < dataRadar.length; i ++){
    let d = dataRadar[i];
    let color = colors[i];
    let coordinates = getPathCoordinates(d);

    //draw the path element
    svgRadar.append("path")
        .datum(coordinates)
        .attr("d",line)
        .attr("stroke-width", 3)
        .attr("stroke", color)
        .attr("fill", color)
        .attr("stroke-opacity", 1)
        .attr("opacity", 0.5);
}

function filter() {
    // console.log($("#roleSelect").val())
    // console.log($("#championSelect").val())
    // console.log($("#statSelect").val())
    // console.log($("#rankSelect").val())

    var filteredData = [];

    var tempData = [];
    // console.log(globalData)
    var tempData2 = [];
    var toShow = true;
    for (let i = globalData.length - 1; i >= 0; i--) {
        toShow = true;
        tempData = [];
        if (globalData[i]["boh"][0]["gameCreation"] !== undefined && globalData[i]["boh"][0]["gameCreation"] !== null) {
            if ($("#roleSelect").val() !== "All Role") {
                if (globalData[i]["boh"][0]["role"] !== $("#roleSelect").val()) {
                    // roleFilteredData.push(globalData[i])
                    toShow = false;
                }
            }
            var champArray = $("#championSelect").val()
            if (champArray[0] !== "All") {
                for (let j = 0; j<champArray.length;j++) {
                    if (globalData[i]["boh"][0]["championId"] === champions[champArray[j]][1].key) {
                        tempData.push(globalData[i])
                    }
                }
            } else tempData.push(globalData[i]);
            // if ($("#rankSelect").val() !== "plat_plus") {
            //     if (globalData[i]["boh"][0]["role"] !== $("#rankSelect").val()) {//TODO
            //         toShow = false;
            //     }
            // }
            if(toShow) {
                for(let j = 0; j<tempData.length; j++) {
                    tempData2.push(tempData[j]);
                }
            }
            console.log(tempData2)
        }} //chiudo for e primo if
    // console.log(tempData)

    for(let i = 0; i<tempData2.length; i++) {
        if(toShow) {
            filteredData.push({
                group: new Date(parseInt(tempData2[i]["boh"][0]["gameCreation"])).toLocaleString(),
                value: parseInt(tempData2[i]["boh"][0][$("#statSelect").val()]),
                win: tempData2[i]["boh"][0]["win"],
                matchId: tempData2[i]["_id"],
                kills: tempData2[i]["boh"][0]["kills"],
                deaths: tempData2[i]["boh"][0]["deaths"],
                assists: tempData2[i]["boh"][0]["assists"],
                totalMinionsKilled: tempData2[i]["boh"][0]["totalMinionsKilled"],
                totalDamageDealt: tempData2[i]["boh"][0]["totalDamageDealt"],
                minutes: tempData2[i]["boh"][1]["frames"].length,
                championId: tempData2[i]["boh"][0]["championId"],
                role: tempData2[i]["boh"][0]["role"],
                gameCreation: tempData2[i]["boh"][0]["gameCreation"],
                index: i
            })
        }
    }
    tempData2 = [];
    redraw(filteredData);
}
