src="https://d3js.org/d3.v5.min.js";

var svg = d3.select("svg")
    width = +svg.attr("width"),
    height = +svg.attr("height");
var pack = d3.pack()
    .size([width-150, height])
    .padding(1.5);
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
  d3.csv("I1.csv").then(function(data){
    var matchData = data.map(function(d){
      if(d.FTR == "H"){
        return{
          date: d.Date,
          hometeam: d.HomeTeam,
          homegoals: +d.FTHG,
          awayteam: d.AwayTeam,
          awaygoals: +d.FTAG,
          winner: d.HomeTeam
        }
      }
      if(d.FTR == "A"){
        return{
          date: d.Date,
          hometeam: d.HomeTeam,
          homegoals: +d.FTHG,
          awayteam: d.AwayTeam,
          awaygoals: +d.FTAG,
          winner: d.AwayTeam
        }
      }
      if(d.FTR == "D"){
        return{
          date: d.Date,
          hometeam: d.HomeTeam,
          homegoals: +d.FTHG,
          awayteam: d.AwayTeam,
          awaygoals: +d.FTAG,
          winner: "Draw"
        }
      }
      });
    var colour = d3.scaleSequential()
        .domain(matchData.map(function(d){return d.awaygoals;}))
        .interpolator(d3.interpolateYlOrBr);
    var root = d3.hierarchy({children: matchData}).sum(function(d) {return d.homegoals; })
    var node = svg.selectAll(".node")
        .data(pack(root).leaves())
        .enter().append("g")
          .attr("class", "node")
          .attr("transform", function(d){return "translate(" + d.x + "," + d.y + ")";})
          .on("mouseover", function(d){
            d3.select(this)
              .transition()
              .style("opacity", 0.5)
            div.transition()
                .style("opacity", 0.9);
            div .html("Match-Date: " + d.data.date + "<br/>" +
                      "Home-Team: " + d.data.hometeam + "<br/>" +
                      "Home-Goals: " + d.data.homegoals + "<br/>" +
                      "Away-Team: " + d.data.awayteam + "<br/>" +
                      "Away-Goals: " + d.data.awaygoals)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
          .on("mouseout", function(d){
            d3.select(this)
              .transition()
              .style("opacity", 1)
            div.transition()
              .duration(500)
              .style("opacity", 0);
          });
    node.append("circle")
        .attr("r", function(d){return d.r;})
        .style("stroke", "black")
        .style("fill", function(d){return colour(d.data.awaygoals);});
    node.append("text")
        .attr("dy", ".2em")
        .style("text-anchor", "middle")
        .text(function(d){return d.data.winner.substring(0, d.r/2);})
        .attr("font-family", "sans-serif")
        .attr("font-size", function(d){return d.r/3;})
        .attr("fill", "black");
  }).catch(console.log.bind(console));
