$.fn.selectpicker.Constructor.BootstrapVersion = '4';

var avgChoice="11";

// var startingEntries = 450;

var championsDict = {};

var avgStatsDictOtherPlayers = {};

var avgStatsArrayOtherPlayers = [];

var avgStatsDict = {};

var avgStatsArray = [];

var champions;

var tooltip;

var globalData;

var rolesPlayed = {};

var data1 = [];

var dataRadar = [];

var features = ["goldEarned","killParticipation","mapControl","totalMinionsKilled","totalDamageDealt","visionScore"];

var featuresString = ["Gold Earned","Kill Participation","Map Control","Minions Killed","Damage Dealt","Vision Score"];

var summonerName;

var selectedStat = "goldEarned";
var selectedStatString = "gold earned";

var playerSelected = "our wave";

var margin = {top: 30, right: 30, bottom: 70, left: 90};
var margin2 = {top: 500, right: 30, bottom: 0, left: 90};
var width = 1000 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;
var height2 = 150 ;//- margin2.top - margin2.bottom;
var offset = 90;

var x = d3.scaleBand()
    .range([0, width])
    .padding(0.1);

var x2 = d3.scaleBand()
    .range([0, width])
    .padding(0.2);

var y = d3.scaleLinear().range([height, 0]);
var y2 = d3.scaleLinear().range([height2, 0]);

var xAxis = d3.axisBottom().scale(x);
var xAxis2 = d3.axisBottom().scale(x2);
var yAxis = d3.axisLeft().scale(y);

x.domain(data1.map(function(d) { return d.gameCreation}));
y.domain([0, d3.max(data1, function(d) { return parseInt(d[selectedStat]); })]);
x2.domain(data1.map(function(d) { return d.gameCreation}));
y2.domain([0, d3.max(data1, function(d) { return parseInt(d[selectedStat]); })]);

var brush = d3.brushX().extent([[0,0],[width,height]]).on("brush",brushed).on("end",brushed);

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right+1000)
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

var myRadartooltip = d3.select("body").append("div")
    .attr("id", "myRadarTooltip")
    .style("opacity", 0);

myRadartooltip.append("text")


function start() {

    d3.json("data/dataset.json")
        .then(function(data) {
            globalData = data;
            games = data;
            AVGgames = data;

            globalData = games;
            for (let i = 0; i < games.length; i++) {
            //     for (let i = 0; i < startingEntries; i++) {

                if (games[i]["game"][0]["summonerName"] === playerSelected) {
                    document.getElementById("summonerName").innerHTML = summonerName = games[i]["game"][0]["summonerName"];

                    var kills = parseInt(games[i]["game"][0]["kills"]);
                    var deaths = parseInt(games[i]["game"][0]["deaths"]);
                    if (deaths === 0) deaths = 1;
                    var assists = parseInt(games[i]["game"][0]["assists"]);
                    var KDA = Math.round(((kills + assists)/deaths)*10)/10;
                    data1.push({
                        group: new Date(parseInt(games[i]["game"][0]["gameCreation"])).toLocaleString(),
                        goldEarned: parseInt(games[i]["game"][0]["goldSpent"]),
                        win: games[i]["game"][0]["win"],
                        matchId: games[i]["_id"],
                        kills: kills,
                        deaths: parseInt(games[i]["game"][0]["deaths"]),
                        assists: assists,
                        KDA: KDA,
                        totalMinionsKilled:parseInt( games[i]["game"][0]["totalMinionsKilled"]),
                        totalDamageDealt: parseInt(games[i]["game"][0]["totalDamageDealt"]),
                        minutes: games[i]["game"][1]["frames"].length,
                        championId: parseInt(games[i]["game"][0]["championId"]),
                        role: games[i]["game"][0]["role"],
                        gameCreation: parseInt(games[i]["game"][0]["gameCreation"]),
                        visionScore: parseInt(games[i]["game"][0]["visionScore"]),
                        mapControl: parseFloat(games[i]["game"][0]["mapControl"]),
                        killParticipation: parseFloat(games[i]["game"][0]["killParticipation"]),
                        index: i
                    })
                    rolesPlayed[games[i]["game"][0]["role"]]=1;
                }

            }
            data1.sort(sortByGameCreation);
            drawBrush(data1)
            drawSpiderChart(data);
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
            var min = d3.min(avgDataOtherPlayers, function(d) { return parseInt(d.gameCreation); });
            var max = d3.max(avgDataOtherPlayers, function(d) { return parseInt(d.gameCreation); });

            var object = null;
            for (let i = 0; i<avgDataOtherPlayers.length;i++){
                //object = avgDataOtherPlayers[i].gameCreation = Math.floor(Math.random()*(max-min)+min);
                avgStatsDictOtherPlayers[avgDataOtherPlayers[i].gameId] = avgDataOtherPlayers[i]//object;
                avgStatsArrayOtherPlayers.push(avgDataOtherPlayers[i])

            } avgStatsArrayOtherPlayers.sort(sortByGameCreation)

            var sumExt0=0;
            var sumExt1=0;
            var sumExt2=0;
            var sumExt3=0;
            var sumExt4=0;
            var sumExt5=0;
            var dataset = avgStatsArrayOtherPlayers;

            var maxExt0=d3.max(dataset, function(d) { return parseInt(d[features[0]])});
            var maxExt3=d3.max(dataset, function(d) { return parseInt(d[features[3]])});
            var maxExt4=d3.max(dataset, function(d) { return parseInt(d[features[4]])});
            var maxExt5=d3.max(dataset, function(d) { return parseInt(d[features[5]])});

            // console.log(avgStatsArrayOtherPlayers)
            for(let i=0; i <dataset.length;i++){
                sumExt0+=parseInt(dataset[i][features[0]]);
                sumExt1+=parseFloat(dataset[i][features[1]]);
                sumExt2+=parseFloat(dataset[i][features[2]]);
                sumExt3+=parseInt(dataset[i][features[3]]);
                sumExt4+=parseInt(dataset[i][features[4]]);
                sumExt5+=parseInt(dataset[i][features[5]]);
            }

            var point = {
                goldEarned: sumExt0/dataset.length/maxExt0,
                killParticipation: sumExt1/dataset.length,
                mapControl: sumExt2/dataset.length,
                totalMinionsKilled: sumExt3/dataset.length/maxExt3,
                totalDamageDealt: sumExt4/dataset.length/maxExt4,
                visionScore: sumExt5/dataset.length/maxExt5
            }

            dataRadar.push(point);

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
    xAxis = d3.axisBottom().scale(x);
    xAxis2 = d3.axisBottom().scale(x2);
    yAxis = d3.axisLeft().scale(y);

    x.domain(data.map(function(d) { return d.gameCreation}));
    y.domain([0, d3.max(data, function(d) { return parseInt(d[selectedStat]); })]);
    x2.domain(data.map(function(d) { return d.gameCreation}));
    y2.domain([0, d3.max(data, function(d) { return parseInt(d[selectedStat]); })]);



    focus.select(".x.axis").call(xAxis)
        .selectAll("text")
        .text(function(d){
            return new Date(parseInt(d)).toLocaleString();})
        .style("font-weight","bold")
        .attr("transform", "translate(-50,40) rotate(-35)");

    focus.select(".y.axis").call(yAxis);


    avgPlayer(data);
    enter(data);
    updateScale(data);
    avgAllPlayers(data);

    var subBars = context.selectAll('.subBar')
        .data(data)
    //TODO
    // var maxHeight = d3.max(data, function(d) { return parseInt(y2(d[selectedStat])); })
    subBars.enter().append("rect")
        .classed('subBar', true)
        .attr("height",function(d) { return height2-y2(d[selectedStat])})
        .attr("width",function() { return x2.bandwidth(); })
        .attr("x",function(d) {
            return x2(d.gameCreation); })
        .attr("y",function(d) {
            return y2(d[selectedStat])-offset})
        .attr("fill", function(d) {
            if (d.win === "true") return "#0073ff"
            else return "#ff0000"});

    //NON TOCCARE
    context.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height2-offset) + ")")
        .call(xAxis2)
        .selectAll(".tick").remove();

    //NON TOCCARE
    context.append("g")
        .attr("class", "x brush")
        .call(brush)
        .selectAll("rect")
        .attr("y", -offset)
        .attr("height", height2 + 7)

    tooltip = d3.select("body").append("div")
        .attr("id", "myTooltip")
        .style("opacity", 0);

    d3.selectAll('.bar').on("mouseover",function() {

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

    d3.selectAll('.avgBar').on("mouseover",function() {

        tooltip.append()
            .transition()
            .duration(200)
            .style("opacity", "1");
    });

    d3.selectAll('.avgBar').on("mouseout",function() {
        // tooltip.style("display", "none");
        tooltip
            .transition()
            .duration(200)
            .style("opacity", "0");

    });

    d3.selectAll('.avgBar').on("mousemove",function() {
        tooltip.style("left", (d3.event.pageX +0) + "px")
            .style("top", (d3.event.pageY -10) + "px");

    });

    focus.append("line")
        .attr("class", "line")
        .attr("x1","1000")
        .attr("y1","10")
        .attr("x2","1050")
        .attr("y2","10")
        .attr("stroke","#b041ff")
        .attr("stroke-width","5");

    focus.select("#legendText1").remove()
    focus.append("text")
        .attr("class", "line")
        .attr("x","1100")
        .attr("y","20")
        .attr("style", "font-size:20")
        .attr("id","legendText1")
        .text("Your own average " + selectedStatString );

    focus.append("line")
        .attr("class", "line")
        .attr("x1","1000")
        .attr("y1","50")
        .attr("x2","1050")
        .attr("y2","50")
        .attr("stroke","#00ff00")
        .attr("stroke-width","5");

    focus.select("#legendText2").remove()
    focus.append("text")
        .attr("class", "line")
        .attr("x","1100")
        .attr("y","60")
        .attr("style", "font-size:20")
        .attr("id","legendText2")
        .text("Average " + selectedStatString + " for other players");

    focus.append("rect")
        .attr("x","1000")
        .attr("y","90")
        .attr("width","20")
        .attr("height","20")
        .attr("fill","#bfbfbf")

    focus.select("#legendText3").remove()
    focus.append("text")
        .attr("class", "line")
        .attr("x","1100")
        .attr("y","110")
        .attr("style", "font-size:20")
        .attr("id","legendText3")
        .text("Teammates average " + selectedStatString);

    focus.append("rect")
        .attr("x","1000")
        .attr("y","140")
        .attr("width","20")
        .attr("height","20")
        .attr("fill","#0073ff")

    focus.select("#legendText4").remove()
    focus.append("text")
        .attr("class", "line")
        .attr("x","1100")
        .attr("y","160")
        .attr("style", "font-size:20")
        .attr("id","legendText4")
        .text("Game Won");

    focus.append("rect")
        .attr("x","1000")
        .attr("y","190")
        .attr("width","20")
        .attr("height","20")
        .attr("fill","#ff0000")

    focus.select("#legendText5").remove()
    focus.append("text")
        .attr("class", "line")
        .attr("x","1100")
        .attr("y","210")
        .attr("style", "font-size:20")
        .attr("id","legendText5")
        .text("Game Lost");

}

function brushed() {
    if(data1.length!==0){
        var data = data1;
        var selection = d3.brushSelection(this);

        if (selection !== null) {

            var selected = x2.domain()
                .filter(function (d) {
                    return (selection[0] <= x2(d) + x2.bandwidth()/2) && (x2(d)+ x2.bandwidth()/2 <= selection[1]);
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
}

function updateScale(data) {
    var tickScale = d3.scalePow().range([data.length / 10, 0]).domain([data.length, 0]).exponent(.5)

    var brushValue = brush.extent()[1] - brush.extent()[0];
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
    y.domain([0, d3.max(data, function(d) { return parseInt(d[selectedStat]);})]);

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
                var value = avgStatsDict[matchId][selectedStat];
            return height - y(value)})
        .attr("width", function () { return x.bandwidth(); })
        .attr("x", function (d) { return x(d.gameCreation); })
        .attr("y", function (d) {
            var matchId = d.matchId.split("_")[0]
            if(avgStatsDict[matchId]!==undefined)
                var value = avgStatsDict[matchId][selectedStat];
            return y(value); })
        .attr("fill", "rgba(0,0,0,0.18)")

    bars.append("rect")
        .classed('bar', true)
        .attr("height", function (d) {
            // console.log(d)
            if(selectedStat==="KDA") {
                if(d[selectedStat]%1>=0.5)
                    return height-y(Math.round(parseInt(d[selectedStat]))+1)
                else return height-y(Math.round(parseInt(d[selectedStat])))
            }
            return height - y(parseInt(d[selectedStat])); })
        .attr("width", function () { return x.bandwidth()*0.8; })
        .attr("x", function (d) { return x(d.gameCreation)+x.bandwidth()/10; })
        .attr("y", function (d) {
            if(selectedStat==="KDA") {
                return y(Math.round(d[selectedStat]))
            }
            return y(d[selectedStat]); })
        .attr("deaths", function(d) { return d.deaths.toString(); })
        .attr("assists", function(d) { return d.assists.toString(); })
        .attr("index", function(d) { return d.index.toString(); })
        .attr("matchId", function(d) { return d.matchId.toString(); })
        .attr("fill", function(d) {
            if (d.win === "true") return "#0073ff"
            else return "#ff0000"})
        .attr("onclick", function(d) { return "showMatch(globalData["+d.index+"])"})
        .attr("onmouseover", function(d) { return "showTooltip(globalData["+d.index+"])"})

    d3.selectAll('.bar').on("mouseover",function() {

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

    d3.selectAll('.avgBar').on("mouseover",function() {

        tooltip.append()
            .transition()
            .duration(200)
            .style("opacity", "1");
    });

    d3.selectAll('.avgBar').on("mouseout",function() {

        tooltip
            .transition()
            .duration(200)
            .style("opacity", "0");

    });

    d3.selectAll('.avgBar').on("mousemove",function() {
        tooltip.style("left", (d3.event.pageX +0) + "px")
            .style("top", (d3.event.pageY -10) + "px");

    });
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
    y.domain([0, d3.max(data, function(d) { return parseInt(d[selectedStat]);})]);

    removeAvgBars()
    removeBars()
    var bars =  focus.selectAll('.bar')
        .data(data)
        .enter()

    bars.append("rect")
        .classed('bar', true)
        .attr("height", function (d) {
            if(selectedStat==="KDA") {
                if(d[selectedStat]%1>=0.5)
                    return height-y(Math.round(parseInt(d[selectedStat]))+1)
                else return height-y(Math.round(parseInt(d[selectedStat])))
            }
            return height - y(parseInt(d[selectedStat])); })
        .attr("width", function () { return x.bandwidth()*0.8; })
        .attr("x", function (d) { return x(d.gameCreation)+x.bandwidth()/10; })
        .attr("y", function (d) {
            if(selectedStat==="KDA") {
                return y(Math.round(d[selectedStat]))
            }
            return y(d[selectedStat]); })
        .attr("deaths", function(d) { return d.deaths.toString(); })
        .attr("assists", function(d) { return d.assists.toString(); })
        .attr("index", function(d) { return d.index.toString(); })
        .attr("matchId", function(d) { return d.matchId.toString(); })
        .attr("fill", function(d) {
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
                var value = avgStatsDict[matchId][selectedStat];
            if(selectedStat==="KDA") {
                value = Math.round(value)
            }
            return height - y(value)})
        .attr("width", function () { return x.bandwidth(); })
        .attr("x", function (d) { return x(d.gameCreation); })
        .attr("y", function (d) {
            var matchId = d.matchId.split("_")[0]
            if(avgStatsDict[matchId]!==undefined)
                var value = avgStatsDict[matchId][selectedStat];
            if(selectedStat==="KDA") value=Math.round(value)
            return y(value); })
        .attr("fill", "rgba(0,0,0,0.18)")
        .attr("onclick", function(d) { return "showMatch(globalData["+d.index+"])"})
        .attr("onmouseover", function(d) { return "showTooltip(globalData["+d.index+"])"});

    d3.selectAll('.bar').on("mouseover",function() {

        tooltip.append()
            .transition()
            .duration(200)
            .style("opacity", "1");
    });

    d3.selectAll('.bar').on("mouseout",function() {

        tooltip
            .transition()
            .duration(200)
            .style("opacity", "0");

    });

    d3.selectAll('.bar').on("mousemove",function() {
        tooltip.style("left", (d3.event.pageX +0) + "px")
            .style("top", (d3.event.pageY -10) + "px");

    });

    d3.selectAll('.avgBar').on("mouseover",function() {

        tooltip.append()
            .transition()
            .duration(200)
            .style("opacity", "1");
    });

    d3.selectAll('.avgBar').on("mouseout",function() {

        tooltip
            .transition()
            .duration(200)
            .style("opacity", "0");

    });

    d3.selectAll('.avgBar').on("mousemove",function() {
        tooltip.style("left", (d3.event.pageX +0) + "px")
            .style("top", (d3.event.pageY -10) + "px");

    });

}

function avgPlayer (data) {
    if(data.length!==0){
        if(avgChoice==="11" || avgChoice==="10") {

            var sum = 0;
            var counter = 0;
            for (let i = 0; i < data.length; i++) {
                sum = sum + data[i][selectedStat];
                counter++;
            }
            var avg = sum / counter;
            // console.log(data)
            focus.select('#AVGPlayerLine').remove()
            focus.append("line")
                .attr("class", "line")
                .attr("x1", "1")
                .attr("y1", function () {
                    return y(avg);
                })
                .attr("x2", "878")
                .attr("y2", function () {
                    return y(avg);
                })
                .attr("stroke", "#b041ff")
                .attr("stroke-width", "5")
                .attr("id", "AVGPlayerLine")
                .on("mouseover",function() {d3.select("#AVGPlayerLine").raise()})
                .on("mouseout",function() {d3.select("#AVGPlayerLine").lower()})
        }
    }
}

function avgAllPlayers(data) {
    if (data.length !== 0) {
        if(avgChoice==="11" || avgChoice==="01"){
            var dataset = avgStatsArrayOtherPlayers;
            var sum = 0;
            var counter = 0;
            for (let i = 0; i < dataset.length; i++) {
                if (dataset[i].gameCreation >= data[0].gameCreation && dataset[i].gameCreation <= data[data.length - 1].gameCreation) {
                    sum = sum + parseInt(dataset[i][selectedStat]);

                    counter++;
                }
            }

            var avg = sum / counter;
            focus.select('#AVGOtherPlayersLine').remove()
            focus.append("line")
                .attr("class", "line")
                .attr("x1", "1")
                .attr("y1", function () {
                    return y(avg);
                })
                .attr("x2", "878")
                .attr("y2", function () {
                    return y(avg);
                })
                .attr("stroke", "green")
                .attr("stroke-width", "5")
                .attr("id", "AVGOtherPlayersLine");
        }
    }
}

$("#searchedSummonerNameForm").submit(function() {
    playerSelected=$("#searchedSummonerName").val();
    filter();
    return false;
});

d3.json("http://ddragon.leagueoflegends.com/cdn/10.15.1/data/en_US/champion.json")
    .then(function(data) {
        var championsArray = Object.entries(data.data);
        for(let i = 0; i<championsArray.length;i++) {
            championsDict[championsArray[i][1].key] = championsArray[i][1];
        }
        champions = championsArray;

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
    var kills = parseInt(data["game"][0].kills);
    var totalMinionsKilled = parseInt(data["game"][0].totalMinionsKilled);
    var minutes = parseInt(data["game"][1]["frames"].length -1);
    var deaths = parseInt(data["game"][0].deaths);
    if(deaths===0) deaths = 1;
    var assists = parseInt(data["game"][0].assists);
    var kda = Math.round(((kills + assists)/deaths)*10)/10;
    var cs4minute = Math.round((totalMinionsKilled/minutes)*10)/10;
    tooltip
        .transition()
        .duration(200)
        .style("opacity", "1");
    tooltip
        .html("<div id='tooltipKDAText'><text id='KDAText'> KDA:"+ kda + "\n" +kills +"/"+ deaths +"/"+ assists + "</text></div>" +
            "<div id='tooltipChampImage'><img style='display: inline' width='60' height='60' src="+ "img/champion/" + championsDict[data["game"][0].championId].image.full +" /></div>" +
            "<div id='tooltipRoleImage'><img style='display: inline' width='60' height='60' src="+ "img/ranked-positions/" + data["game"][0].role +".png /></div>" +
            "<div id='tooltipCSText'><text id='CSText'> CS: " + totalMinionsKilled + "\n" +cs4minute +"/minute" + "</text></div>")
}

function showMatch(data) {

    console.log(data);
    // d3.select('#championModalImage').remove()
    // d3.select('#championModalDiv').append("img")
    //     .attr("src","/resources/img/champion/" + championsDict[data["game"][0].championId].image.full + "")
    //     .attr("id","championModalImage")
    //     .attr("width","120")
    //     .attr("height","120");
    //
    // // d3.select('#championModalDiv').append("img")
    //
    // $('#gameModal').modal('show')

}

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

function drawSpiderChart(data) {

    var sumExt0=0;
    var sumExt1=0;
    var sumExt2=0;
    var sumExt3=0;
    var sumExt4=0;
    var sumExt5=0;
    var dataset = data1;

    var maxExt0=d3.max(dataset, function(d) { return parseInt(d[features[0]])});
    var maxExt3=d3.max(dataset, function(d) { return parseInt(d[features[3]])});
    var maxExt4=d3.max(dataset, function(d) { return parseInt(d[features[4]])});
    var maxExt5=d3.max(dataset, function(d) { return parseInt(d[features[5]])});

    for(let i=0; i <data1.length;i++){
        sumExt0+=parseInt(dataset[i][features[0]]);
        sumExt1+=parseFloat(dataset[i][features[1]]);
        sumExt2+=parseFloat(dataset[i][features[2]]);
        sumExt3+=parseInt(dataset[i][features[3]]);
        sumExt4+=parseInt(dataset[i][features[4]]);
        sumExt5+=parseInt(dataset[i][features[5]]);
    }

    var point = {
        goldEarned: sumExt0/dataset.length/maxExt0,
        killParticipation: sumExt1/dataset.length,
        mapControl: sumExt2/dataset.length,
        totalMinionsKilled: sumExt3/dataset.length/maxExt3,
        totalDamageDealt: sumExt4/dataset.length/maxExt4,
        visionScore: sumExt5/dataset.length/maxExt5
    }

    dataRadar.push(point);

    var dim = 128;

    d3.select("#svgRadar").remove();
    let svgRadar = d3.select("#player_container").append("svg")
        .attr("id","svgRadar")
        .attr("width", dim*1.1)
        .attr("height", dim*1.1);


    let radialScale = d3.scaleLinear()
        .domain([0,1])
        .range([0,dim/2]);

    let ticks = [0.2,0.4,0.6,0.8,1];

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
        let line_coordinate = angleToCoordinate(angle, 1);
        let label_coordinate = angleToCoordinate(angle, 1.5);

        //draw axis line
        svgRadar.append("line")
            .attr("x1", dim/2)
            .attr("y1", dim/2)
            .attr("x2", line_coordinate.x)
            .attr("y2", line_coordinate.y)
            .attr("stroke","rgba(0,0,0,0.2)")
            .attr("stroke-width","5")
            .attr("featureNumber",i)
            .on("mouseover",function(){
                myRadartooltip
                    .transition()
                    .duration(200)
                    .style("opacity", "1")
                console.log(this.getAttribute("featureNumber"))
                updateMyRadarTooltip(this.getAttribute("featureNumber"))
            })
            .on("mousemove",function(){
                myRadartooltip
                    .style("left", (d3.event.pageX +0) + "px")
                    .style("top", (d3.event.pageY -10) + "px");

            })
            .on("mouseout",function(){
                myRadartooltip
                    .transition()
                    .duration(1000)
                    .style("opacity", "0");
            });



        // draw axis label
        // svgRadar.append("text")
        //     .attr("x", label_coordinate.x-10)
        //     .attr("y", label_coordinate.y-10)
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
}

function filter() {
    var playedChampArray = [];
    champArray = $("#championSelect").val();
    if(champArray[0]!=="All"){
        for (let j = 0; j<champArray.length;j++) {
            playedChampArray.push(champions[champArray[j]][1].key)
        }
    }
    data1=[];
    var tempData=[];
    globalData=[];
    d3.json("data/dataset.json")
        .then(function(data) {
            globalData = data;
            games = data;
            AVGgames = data;

            globalData = games;
            // for (let i = 0; i < startingEntries; i++) {
                for (let i = 0; i < games.length; i++) {

                if (games[i]["game"][0]["summonerName"] === playerSelected) {
                    //////////////////////////////////////////////////////////////////////////////////////////
                    if($("#roleSelect").val()==="All Role") {
                        document.getElementById("summonerName").innerHTML = summonerName = games[i]["game"][0]["summonerName"];

                        var kills = parseInt(games[i]["game"][0]["kills"]);
                        var deaths = parseInt(games[i]["game"][0]["deaths"]);
                        if (deaths === 0) deaths = 1;
                        var assists = parseInt(games[i]["game"][0]["assists"]);
                        var KDA = Math.round(((kills + assists)/deaths)*10)/10;
                        tempData.push({
                            group: new Date(parseInt(games[i]["game"][0]["gameCreation"])).toLocaleString(),
                            goldEarned: parseInt(games[i]["game"][0]["goldSpent"]),
                            win: games[i]["game"][0]["win"],
                            matchId: games[i]["_id"],
                            kills: kills,
                            deaths: parseInt(games[i]["game"][0]["deaths"]),
                            assists: assists,
                            KDA: KDA,
                            totalMinionsKilled:parseInt( games[i]["game"][0]["totalMinionsKilled"]),
                            totalDamageDealt: parseInt(games[i]["game"][0]["totalDamageDealt"]),
                            minutes: games[i]["game"][1]["frames"].length,
                            championId: parseInt(games[i]["game"][0]["championId"]),
                            role: games[i]["game"][0]["role"],
                            gameCreation: parseInt(games[i]["game"][0]["gameCreation"]),
                            visionScore: parseInt(games[i]["game"][0]["visionScore"]),
                            mapControl: parseFloat(games[i]["game"][0]["mapControl"]),
                            killParticipation: parseFloat(games[i]["game"][0]["killParticipation"]),
                            index: i
                        })
                        rolesPlayed[games[i]["game"][0]["role"]] = 1;
                        // console.log(parseInt(games[i]["game"][0]["gameCreation"]))


                    } else {
                        if(games[i]["game"][0]["role"]===$("#roleSelect").val()){
                            document.getElementById("summonerName").innerHTML = summonerName = games[i]["game"][0]["summonerName"];

                            var kills = parseInt(games[i]["game"][0]["kills"]);
                            var deaths = parseInt(games[i]["game"][0]["deaths"]);
                            if (deaths === 0) deaths = 1;
                            var assists = parseInt(games[i]["game"][0]["assists"]);
                            var KDA = Math.round(((kills + assists)/deaths)*10)/10;
                            tempData.push({
                                group: new Date(parseInt(games[i]["game"][0]["gameCreation"])).toLocaleString(),
                                goldEarned: parseInt(games[i]["game"][0]["goldSpent"]),
                                win: games[i]["game"][0]["win"],
                                matchId: games[i]["_id"],
                                kills: kills,
                                deaths: parseInt(games[i]["game"][0]["deaths"]),
                                assists: assists,
                                KDA: KDA,
                                totalMinionsKilled:parseInt( games[i]["game"][0]["totalMinionsKilled"]),
                                totalDamageDealt: parseInt(games[i]["game"][0]["totalDamageDealt"]),
                                minutes: games[i]["game"][1]["frames"].length,
                                championId: parseInt(games[i]["game"][0]["championId"]),
                                role: games[i]["game"][0]["role"],
                                gameCreation: parseInt(games[i]["game"][0]["gameCreation"]),
                                visionScore: parseInt(games[i]["game"][0]["visionScore"]),
                                mapControl: parseFloat(games[i]["game"][0]["mapControl"]),
                                killParticipation: parseFloat(games[i]["game"][0]["killParticipation"]),
                                index: i
                            })
                            rolesPlayed[games[i]["game"][0]["role"]] = 1;
                            // console.log(parseInt(games[i]["game"][0]["gameCreation"]))

                        }
                    }
                }

/////////////////////////////////////////////////////////////////////////////////
            }
            if($("#championSelect").val()[0]==="All"){
                data1=tempData;
            } else {
                for(let i=0; i < tempData.length; i++) {
                    for (let j = 0; j < playedChampArray.length; j++) {
                        if(parseInt(tempData[i].championId)===parseInt(playedChampArray[j])){
                            data1.push(tempData[i]);
                        }
                    }
                }
            }

            if(data1.length===0){
                alert("There are no games with these filters :(")
            }
            data1.sort(sortByGameCreation);
            cleanAll()
            drawBrush(data1)
        })
        .catch(function(error) {
            console.log(error);
        })
}

function cleanAll() {
    d3.selectAll(".selection").remove();
    d3.selectAll(".bar").remove();
    d3.selectAll(".avgBar").remove();
    d3.selectAll(".subBar").remove();
    d3.selectAll("#AVGOtherPlayersLine").remove();
    d3.selectAll("#AVGPlayerLine").remove();
    d3.selectAll("#myTooltip").remove();
    x.domain(data1.map(function(d) { return d.gameCreation}));
    y.domain([0, d3.max(data1, function(d) { return parseInt(d[selectedStat]); })]);
    x2.domain(data1.map(function(d) { return d.gameCreation}));
    y2.domain([0, d3.max(data1, function(d) { return parseInt(d[selectedStat]); })]);

    xAxis = d3.axisBottom().scale(x);
}

$("#statSelect").on("change", function(){

    selectedStat=$("#statSelect").val();
    if($("#statSelect").val()==="goldEarned"){
        selectedStatString="gold earned";
    }
    if($("#statSelect").val()==="kills"){
        selectedStatString="kills";
    }
    if($("#statSelect").val()==="deaths"){
        selectedStatString="deaths";
    }
    if($("#statSelect").val()==="assists"){
        selectedStatString="assists";
    }
    if($("#statSelect").val()==="totalMinionsKilled"){
        selectedStatString="minions killed";
    }
    if($("#statSelect").val()==="visionScore"){
        selectedStatString="vision score";
    }
    if($("#statSelect").val()==="totalDamageDealt"){
        selectedStatString="damage dealt";
    }
    if($("#statSelect").val()==="KDA"){
        selectedStatString="KDA";
    }
})

$("#avgSelect").on("change", function() {
    avgChoice = $("#avgSelect").val();
    console.log($("#avgSelect").val())
})

function updateMyRadarTooltip(i) {
    myRadartooltip.select("text").text(featuresString[i]);
}

// function stream() {
//     console.log("Stream")
//     if(startingEntries<550) {
//         startingEntries += 10;
//         filter();
//     }
// }
// (function(){
//     stream();
//     setTimeout(arguments.callee,10000);
// })();
