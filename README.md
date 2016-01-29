#This project is a visualization of history and trends in number of internet users between countries, with event highlights.

##Summary
Internet has grown rapidly in the past years - it is even hard to imagine that a decade or two ago communication was so much harder than today.<br>
I tried to show how internet developed in the span of 1990 - 2014, using 3 metrics for each country: number of internet users, increase in users from previous year, and percentage of total population using internet (penetration).<br>
Also, I've made some highlights about the topic for each year.

##Design
The main thing that I wanted to highlight is what countries contributed the most to the total number of internet users. A bar chart is very useful for making such comparisons.<br>
Other reasonable choices could be:
- Bubble chart, with x = number of users and y = percentage of population. Size of the point could denote the total population, and color - increase from previous year.
- Line chart for total internet population
- Area chart for internet population between countries. This can be a bit cluttered as there are many countries that I want to display.
I chose bar chart because it highlights the difference in internet population between countries (unlike bubble chart) and allows interactivity as it only shows one year at a time (unlike line/area charts).<br>

There is a possibility to add a button to switch between types of charts, and this could be next logical step in improving the visualization.

##Feedback
My comments on the feedback are given in __*bold italics*__.

####Person 1:
There is a couple of typos and too many commas, which makes sentences a bit too complicated, in my opinion.<br>
__*Corrected the typos and rewrote some sentences.*__<br>
1. What do you notice in the visualization?<br>
It's quite easy to navigate and understand. Minimalistic design and inviting to the eye.<br>
2. What questions do you have about the data?<br>
No questions at all but it inspired me to know more about the topic.<br>
3. What relationships do you notice?<br>
It was interesting to notice how the percentage of population using the internet was changing through the years and compare it to the information above the graph the author gave.<br>
4. What do you think is the main takeaway from this visualization?<br>
Well we are living in a crazy and fast evolving world and we need to catch on with it. Also Dream big!<br>
5. Is there something you don’t understand in the graphic?<br>
I'm quite curious how it was done. The programming I mean. Everything else was a little effort to understand as I already mentioned.<br>
__*That's D3.js, and I love it!*__

#### Person 2:
I love this. The explanations that go with it make the story super engaging. It's a really cool topic. A couple things I would have liked to see:
- you have the number of users per country, which is good info, but if you were able to collect population data, it would be cool to also see the proportion of the country's population using the internet each year. (ie USA 2014 - 278.6M, 318.9M pop, so 87.3% of 2014 population using internet). The growth in terms of percentages would also show which countries, large or small, or making the greatest advancement relative to their size.
- Similarly, could we have a running total of the world population as well? Perhaps as a bar that is filling up to 100%, with percentage increase just like the countries.<br>

__*I've added percentage of population using internet as a separate column.<br>
Didn't find where to fit the total world population using internet, and these numbers are in some descriptions.*__

#### Person 3:
The page doesn't open from the phone.
You could use Bootstrap for this project.<br>
__*Using bootstrap for ensuring consistent layout would be logical for this project, and I might do this in future.*__

#### Person 4:
Not all countries are fit to the screen.<br>
__*I've changed it so that if bars don't fit into the screen, the number of bars is reduced accordingly.*__

#### Person 5:
It doesn't open on Safari, had to use Firefox.<br>
__*Safari and IE don't support fat arrow (=>) syntax, that was introduced in ECMAScript 6. Replaced all fat arrows with regular anonymous function syntax.*__<br>
The main weakness in my opinion is that the rule of size is broken. Diagram occupies unjustifiably large place, and it's only used to compare different countries. But comparison isn't the main thing in this presentation. Main things are events in the text and chronology. Best choice in this case would be a timeline. Put main events with pictograms there + colored pie charts of different sizes (color encode the countries, size encodes total number of users). There could be many variants that will be much more compact than a bar chart.<br>
__*The main thing that I wanted to highlight is the change in counties with most users during the timespan, which leads the viewer to conclusion that internet is something very different from what it was when it emerged. A line chart or area chart for total internet population could be reasonable, but I cannot agree with pie charts. Maybe pie charts could be substituted with bar charts/tables, but anyway the graph would be very cluttered.*__

####Person 6:
The text is barely readable because the font is too thin.<br>
__*Changed font from normal to semibold.*__

##Resources
__Data__:<br>
http://knoema.com/WBWDIGDF2015Dec/world-development-indicators-wdi-december-2015<br>
__Tools:__<br>
http://d3js.org/<br>
https://github.com/Caged/d3-tip<br>
http://bost.ocks.org/mike/<br>
http://bl.ocks.org/mbostock<br>
https://www.dashingd3js.com/table-of-contents<br>
http://www.w3schools.com/<br>
http://stackoverflow.com/questions<br>
__Annotations:__<br>
http://info.cern.ch/hypertext/WWW/TheProject.html<br>
https://en.wikipedia.org/wiki/History_of_the_World_Wide_Web<br>
https://en.wikipedia.org/wiki/History_of_the_Internet<br>
https://en.wikipedia.org/wiki/Year_2000_problem<br>
https://en.wikipedia.org/wiki/Dot-com_bubble<br>
http://mentalfloss.com/article/55468/11-epic-rickrolls<br>
https://blog.whatsapp.com/189/one-billion-messages<br>
http://youtube-global.blogspot.ru/2011/12/what-were-we-watching-this-year-lets.html<br>
http://www.nytimes.com/interactive/2012/05/17/business/dealbook/how-the-facebook-offering-compares.html<br>
https://www.comscore.com/Insights/Blog/Number-of-Mobile-Only-Internet-Users-Now-Exceeds-Desktop-Only-in-the-U.S<br>
http://www.pewinternet.org/2014/03/11/digital-life-in-2025/<br>
http://www.marxentlabs.com/what-is-virtual-reality-definition-and-examples/<br>
http://digitalintelligencetoday.com/the-10-business-models-of-digital-disruption-and-how-to-respond-to-them/<br>