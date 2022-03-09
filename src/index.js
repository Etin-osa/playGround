import Modeler from "bpmn-js/lib/Modeler";
import camundaModdlePackage from "camunda-bpmn-moddle/resources/camunda";
import camundaModdleExtension from "camunda-bpmn-moddle/lib";
import PropertiesPanel from "bpmn-js-properties-panel";
import propertiesProviderModule from "bpmn-js-properties-panel/lib/provider/camunda";

// styles
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css";

import "./styles/main.scss";

const btn = document.querySelector('#collect-xml');

const xml = `
<?xml version="1.0" encoding="UTF-8"?>
  <bpmn:definitions
    xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
    xmlns:cmmn="http://www.omg.org/spec/CMMN/20151109/MODEL"
    xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
    xmlns:modeler="http://camunda.org/schema/modeler/1.0"
    id="Definitions_0bfwl6a" targetNamespace="http://bpmn.io/schema/bpmn"
    exporter="Camunda Modeler" exporterVersion="4.12.0"
    modeler:executionPlatform="Camunda Platform"
    modeler:executionPlatformVersion="7.15.0">
      <bpmn:process id="Process_0w0hjid" isExecutable="true" />
      <bpmndi:BPMNDiagram id="BPMNDiagram_1">
        <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_0w0hjid" />
      </bpmndi:BPMNDiagram>
  </bpmn:definitions>
`



const modeler = new Modeler({
  container: '#app',
  keyboard: {
    bindTo: document
  },
  propertiesPanel: {
    parent: "#app-panel"
  },
  additionalModules: [
    camundaModdleExtension,
    PropertiesPanel,
    propertiesProviderModule,
  ],
  moddleExtensions: {
    camunda: camundaModdlePackage,
  }
});

let log = console.log


async function bpmn() {
  try {
    const { warnings } = await modeler.importXML(xml)
    modeler.get('canvas').zoom("fit-viewport");

  } catch(err) {
    console.log(err)
  }
}

// Get list
btn.addEventListener('click', async () => {
  try {
    const { xml } = await modeler.saveXML()
    console.log(xml)
  } catch (err) {
    console.log(err)
  }
})


bpmn()