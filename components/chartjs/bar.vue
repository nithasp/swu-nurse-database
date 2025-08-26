<template>
   <div style="position: relative; height: 300px">
      <canvas :id="idChart" style="max-height: 100%"></canvas>
   </div>
</template>
<script setup>
import Chart from "chart.js/auto";

const props = defineProps({
   labels: Array,
   datasets: Array,
   labelY: String,
   labelX: String,
   idChart: String,
   tooltipShow: String,
   titleShow: Boolean,
   agencyName: String
});

watch(
   () => props.labels,
   (newValue) => {
      chart.data.labels = newValue;
      chart.update();
   }
);

let chart = null;
onMounted(() => {
   const ctx = document.getElementById(props.idChart);

   const genTitleAbove = {
      id: 'titleAbove',
      beforeDraw: (chart) => {
         const ctx = chart.ctx;
         const chartArea = chart.chartArea;
         const xPosition = 0;
         const yPosition = chartArea.top - 50;

         ctx.save();
         ctx.font = "16px Sarabun";
         ctx.fillStyle = "#333";
         ctx.textAlign = "left";
         ctx.fillText(props.agencyName, xPosition, yPosition);
         ctx.restore();
      },
   };
   const genTitleY = {
      id: 'titleY',
      afterDraw: (chart) => {
         const ctx = chart.ctx;
         const xPosition = chart.scales.x.left - 60;
         const yPosition = chart.chartArea.top - 20;

         ctx.save();
         ctx.font = "12px Sarabun";
         ctx.fillStyle = "#333";
         ctx.textAlign = "left";
         ctx.fillText(props.labelY, xPosition, yPosition);
         ctx.restore();
      },
   };

   const genTitleX = {
      id: 'titleX',
      afterDraw: (chart) => {
         const ctx = chart.ctx;
         const xPosition = chart.scales.x.left - 60;
         const yPosition = chart.chartArea.bottom + 21;

         ctx.save();
         ctx.font = "12px Sarabun";
         ctx.fillStyle = "#333";
         ctx.textAlign = "left";
         ctx.fillText(props.labelX, xPosition, yPosition);
         ctx.restore();
      },
   };

   let delayed;
   const chart = new Chart(ctx, {
      type: "bar",
      data: {
         labels: props.labels,
         datasets: props.datasets,
      },
      options: {
         animation: {
            onComplete: () => {
               delayed = true;
            },
            delay: (context) => {
               let delay = 0;
               if (context.type === "data" && context.mode === "default" && !delayed) {
                  delay = context.dataIndex * 300 + context.datasetIndex * 100;
               }
               return delay;
            },
         },
         layout: {
            padding: {
               top: props.titleShow ? 60 : 40,
               left: 40,
            },
         },
         scales: {
            y: {
               beginAtZero: true,
               grid: {
                  tickColor: "transparent",
               },
               border: {
                  display: false,
               },
               ticks: {
                  stepSize: 10,
               },
            },
            x: {
               grid: {
                  tickColor: "transparent",
               },
            },
         },
         plugins: {
            legend: {
               position: "bottom",
               align: "start",
               labels: {
                  padding: 20,
                  usePointStyle: true,
                  pointStyle: "rect",
               },
            },
            tooltip: {
               enabled: false,
               external: externalTooltipHandler,
            },
         },
      },
      plugins: props.titleShow ? [genTitleAbove, genTitleX, genTitleY] : [genTitleX, genTitleY],
   });
});


const getOrCreateTooltip = (chart) => {
   let tooltipEl = chart.canvas.parentNode.querySelector("div");

   if (!tooltipEl) {
      tooltipEl = document.createElement("div");
      tooltipEl.className = "arrow-tooltips";
      tooltipEl.style.background = "#fff";
      tooltipEl.style.borderRadius = "8px";
      tooltipEl.style.color = "#333";
      tooltipEl.style.opacity = 1;
      tooltipEl.style.pointerEvents = "none";
      tooltipEl.style.position = "absolute";
      // tooltipEl.style.transform = "translatY(-50%)";
      tooltipEl.style.transition = "all .3s ease";
      tooltipEl.style.borderWidth = "1px";
      tooltipEl.style.borderStyle = "solid";
      tooltipEl.style.borderColor = "#E2E2E2";
      tooltipEl.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";

      const table = document.createElement("table");
      table.style.margin = "0px";

      tooltipEl.appendChild(table);
      chart.canvas.parentNode.appendChild(tooltipEl);
   }

   return tooltipEl;
};

const externalTooltipHandler = (context) => {
   if (!props.tooltipShow) {
      return;
   }
   const { chart, tooltip } = context;
   const tooltipEl = getOrCreateTooltip(chart);

   // Hide if no tooltip
   if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
   }

   // Set Text
   if (tooltip.body) {
      const tableBody = document.createElement("tbody");
      getTooltipDetail(context, tableBody);
      const tableRoot = tooltipEl.querySelector("table");

      // Remove old children
      while (tableRoot.firstChild) {
         tableRoot.firstChild.remove();
      }
      tableRoot.appendChild(tableBody);
   }

   const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

   tooltipEl.style.opacity = 1;
   tooltipEl.style.left = positionX + tooltip.caretX + "px";
   tooltipEl.style.top = positionY + tooltip.caretY + "px";
   tooltipEl.style.font = tooltip.options.bodyFont.string;
   tooltipEl.style.padding = "8px " + tooltip.options.padding + "px";
};

const getTooltipDetail = (context, tableBody) => {
   const { tooltip } = context;
   const { dataset, formattedValue, label } = tooltip.dataPoints[0];

   switch (props.tooltipShow) {
      // Personal
      case "personal-1": {
         const dataTooltips = [
            {
               title: "จำนวน :",
               value: dataset.amount,
            },
            {
               title: "ตำแหน่งว่าง :",
               value: dataset.free,
            },
            {
               title: "คิดเป็นร้อยละ :",
               value: dataset.percent,
            },
         ];
         for (let i = 0; i < dataTooltips.length; i++) {
            const tr = document.createElement("tr");
            tr.style.height = "18px";
            tr.style.display = "flex";

            const td = document.createElement("td");
            td.style.display = "flex";
            td.style.alignItems = "center";

            const p = document.createElement("p");
            p.style.fontSize = "12px";
            p.style.paddingRight = "4px";
            const text = document.createTextNode(`${dataTooltips[i].title}`);
            p.appendChild(text);

            const p2 = document.createElement("p");
            p2.style.fontSize = "12px";
            p2.style.color = "#F26522";
            const text2 = document.createTextNode(dataTooltips[i].value);
            p2.appendChild(text2);

            td.appendChild(p);
            td.appendChild(p2);
            tr.appendChild(td);
            tableBody.appendChild(tr);
         }
         break;
      }
      case "personal-2":
      case "personal-3": {
         const dataTooltips = [
            {
               title: dataset.label,
            },
            {
               title: "จำนวน :",
               value: dataset.amount,
            },
            {
               title: "คิดเป็นร้อยละ :",
               value: dataset.percent,
            },
         ];
         for (let i = 0; i < dataTooltips.length; i++) {
            const tr = document.createElement("tr");
            tr.style.height = "18px";
            tr.style.display = "flex";

            const td = document.createElement("td");
            td.style.display = "flex";
            td.style.alignItems = "center";

            const p = document.createElement("p");
            p.style.fontSize = "12px";
            p.style.paddingRight = "4px";
            const text = document.createTextNode(`${dataTooltips[i].title}`);
            p.appendChild(text);

            const p2 = document.createElement("p");
            if (dataTooltips[i].value) {
               p2.style.fontSize = "12px";
               p2.style.color = "#F26522";
               const text2 = document.createTextNode(dataTooltips[i].value);
               p2.appendChild(text2);
            }

            td.appendChild(p);
            if (dataTooltips[i].value) {
               td.appendChild(p2);
            }
            tr.appendChild(td);
            tableBody.appendChild(tr);
         }
         break;
      }

      // Academic
      case "academic-comparison-by-year":
         {
            const dataTooltips = [
               {
                  title: `${dataset.yearTypeValue}: ${label}`,
                  value: ""
               },
               {
                  title: `${dataset.label}`,
                  value: ""
               },
               {
                  title: "",
                  value: `${formattedValue} โครงการ`,
               },
            ];
            for (let i = 0; i < dataTooltips.length; i++) {
               const tr = document.createElement("tr");
               tr.style.height = "18px";
               tr.style.display = "flex";

               const td = document.createElement("td");
               td.style.display = "flex";
               td.style.alignItems = "center";

               const p = document.createElement("p");
               p.style.fontSize = "12px";
               const text = document.createTextNode(`${dataTooltips[i].title}`);
               p.appendChild(text);

               const p2 = document.createElement("p");
               p2.style.fontSize = "14px";
               p2.style.fontWeight = "700";
               p2.style.color = "#F26522";
               const text2 = document.createTextNode(dataTooltips[i].value);
               p2.appendChild(text2);

               td.appendChild(p);
               td.appendChild(p2);
               tr.appendChild(td);
               tableBody.appendChild(tr);
            }
            break;
      }
      case "academic-budget-allocation": {
         const dataTooltips = [
            {
               title: `${dataset.label} ปี ${label}`
            },
            {
               title: "",
               value: `${formattedValue} บาท`,
            },
         ];
         for (let i = 0; i < dataTooltips.length; i++) {
            const tr = document.createElement("tr");
            tr.style.height = "18px";
            tr.style.display = "flex";

            const td = document.createElement("td");
            td.style.display = "flex";
            td.style.alignItems = "center";

            const p = document.createElement("p");
            p.style.fontSize = "12px";
            p.style.marginBottom = "4px";
            p.style.whiteSpace = "nowrap";
            const text = document.createTextNode(`${dataTooltips[i].title}`);
            p.appendChild(text);

            const p2 = document.createElement("p");
            if (dataTooltips[i].value) {
               p2.style.fontSize = "14px";
               p2.style.fontWeight = "700";
               p2.style.color = "#F26522";
               p2.style.whiteSpace = "nowrap";
               const text2 = document.createTextNode(dataTooltips[i].value);
               p2.appendChild(text2);
            }

            td.appendChild(p);
            if (dataTooltips[i].value) {
               td.appendChild(p2);
            }
            tr.appendChild(td);
            tableBody.appendChild(tr);
         }
         break;
      }
      case "academic-year-service-projects": {
         const dataTooltips = [
            {
               title: `${dataset.label} ปี ${label}`
            },
            {
               title: "",
               value: `${formattedValue} โครงการ`,
            },
         ];
         for (let i = 0; i < dataTooltips.length; i++) {
            const tr = document.createElement("tr");
            tr.style.height = "18px";
            tr.style.display = "flex";

            const td = document.createElement("td");
            td.style.display = "flex";
            td.style.alignItems = "center";

            const p = document.createElement("p");
            p.style.fontSize = "12px";
            p.style.marginBottom = "4px";
            p.style.whiteSpace = "nowrap";
            const text = document.createTextNode(`${dataTooltips[i].title}`);
            p.appendChild(text);

            const p2 = document.createElement("p");
            if (dataTooltips[i].value) {
               p2.style.fontSize = "14px";
               p2.style.fontWeight = "700";
               p2.style.color = "#F26522";
               p2.style.whiteSpace = "nowrap";
               const text2 = document.createTextNode(dataTooltips[i].value);
               p2.appendChild(text2);
            }

            td.appendChild(p);
            if (dataTooltips[i].value) {
               td.appendChild(p2);
            }
            tr.appendChild(td);
            tableBody.appendChild(tr);
         }
         break;
      }

      // Research
      case "research-percent": {
         const dataTooltips = [
            {
               title: "จำนวนงานวิจัย:",
               value: `${formattedValue}`,
            },
            {
               title: `${dataset.yearTypeValue}:`,
               value: label
            },
         ];
         for (let i = 0; i < dataTooltips.length; i++) {
            const tr = document.createElement("tr");
            tr.style.height = "18px";
            tr.style.display = "flex";

            const td = document.createElement("td");
            td.style.display = "flex";
            td.style.alignItems = "center";

            const p = document.createElement("p");
            p.style.fontSize = "12px";
            p.style.paddingRight = "4px";
            const text = document.createTextNode(`${dataTooltips[i].title}`);
            p.appendChild(text);

            const p2 = document.createElement("p");
            p2.style.fontSize = "12px";
            p2.style.color = "#F26522";
            const text2 = document.createTextNode(dataTooltips[i].value);
            p2.appendChild(text2);

            td.appendChild(p);
            td.appendChild(p2);
            tr.appendChild(td);
            tableBody.appendChild(tr);
         }
         break;
      }
      case "research-comparison-by-year":
         {
            const dataTooltips = [
               {
                  title: `${dataset.yearTypeValue}:`,
                  value: label
               },
               {
                  title: `${dataset.label}`,
                  value: ""
               },
               {
                  title: "จำนวนผลงาน:",
                  value: `${formattedValue}`,
               },
            ];
            for (let i = 0; i < dataTooltips.length; i++) {
               const tr = document.createElement("tr");
               tr.style.height = "18px";
               tr.style.display = "flex";

               const td = document.createElement("td");
               td.style.display = "flex";
               td.style.alignItems = "center";

               const p = document.createElement("p");
               p.style.fontSize = "12px";
               p.style.paddingRight = "4px";
               const text = document.createTextNode(`${dataTooltips[i].title}`);
               p.appendChild(text);

               const p2 = document.createElement("p");
               p2.style.fontSize = "12px";
               p2.style.color = "#F26522";
               const text2 = document.createTextNode(dataTooltips[i].value);
               p2.appendChild(text2);

               td.appendChild(p);
               td.appendChild(p2);
               tr.appendChild(td);
               tableBody.appendChild(tr);
            }
            break;
      }
      case "research-comparison-by-field":
         {
            const dataTooltips = [
               {
                  title: `${dataset.yearTypeValue} ${label}`
               },
               {
                  title: `${dataset.label}`
               },
               {
                  title: "",
                  value: `${formattedValue} โครงการ`,
               },
            ];
            for (let i = 0; i < dataTooltips.length; i++) {
               const tr = document.createElement("tr");
               tr.style.height = "18px";
               tr.style.display = "flex";

               const td = document.createElement("td");
               td.style.display = "flex";
               td.style.alignItems = "center";

               const p = document.createElement("p");
               p.style.fontSize = "12px";
               p.style.marginBottom = "4px";
               p.style.whiteSpace = "nowrap";
               const text = document.createTextNode(`${dataTooltips[i].title}`);
               p.appendChild(text);

               const p2 = document.createElement("p");
               if (dataTooltips[i].value) {
                  p2.style.fontSize = "14px";
                  p2.style.fontWeight = "400";
                  p2.style.color = "#F47F47";
                  p2.style.whiteSpace = "nowrap";
                  const text2 = document.createTextNode(dataTooltips[i].value);
                  p2.appendChild(text2);
               }

               td.appendChild(p);
               if (dataTooltips[i].value) {
                  td.appendChild(p2);
               }
               tr.appendChild(td);
               tableBody.appendChild(tr);
            }
            break;
      }
      case "research-funding-support": {
         const dataTooltips = [
            {
               title: `${dataset.yearTypeValue}:`,
               value: label
            },
            {
               title: "จำนวนทุน:",
               value: `${formattedValue}`,
            },

         ];
         for (let i = 0; i < dataTooltips.length; i++) {
            const tr = document.createElement("tr");
            tr.style.height = "18px";
            tr.style.display = "flex";

            const td = document.createElement("td");
            td.style.display = "flex";
            td.style.alignItems = "center";

            const p = document.createElement("p");
            p.style.fontSize = "12px";
            p.style.paddingRight = "4px";
            const text = document.createTextNode(`${dataTooltips[i].title}`);
            p.appendChild(text);

            const p2 = document.createElement("p");
            p2.style.fontSize = "12px";
            p2.style.color = "#F26522";
            const text2 = document.createTextNode(dataTooltips[i].value);
            p2.appendChild(text2);

            td.appendChild(p);
            td.appendChild(p2);
            tr.appendChild(td);
            tableBody.appendChild(tr);
         }
         break;
      }
   }
};
</script>
<style lang="scss">
.arrow-tooltips::before {
   content: "";
   position: absolute;
   left: -12px;
   top: 15%;
   transform: rotate(180deg);
   border-width: 6px;
   border-style: solid;
   border-color: transparent transparent transparent #fff;
}
</style>
