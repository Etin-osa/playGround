import $ from 'jquery';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import customTranslate from "./customTranslate/customTranslate";
import camundaModdlePackage from "camunda-bpmn-moddle/resources/camunda";
import camundaModdleExtension from "camunda-bpmn-moddle/lib";
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
  CamundaPlatformPropertiesProviderModule,
  ElementTemplatesPropertiesProviderModule
} from 'bpmn-js-properties-panel';

// styles
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "bpmn-js-properties-panel/dist/assets/element-templates.css";
import "bpmn-js-properties-panel/dist/assets/properties-panel.css";
import './styles/main.scss'

const diagramXML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" id="Definitions_0ex8ya2" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="4.4.0">
  <bpmn:process id="Process_03dsped" />
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_03dsped" />
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`
const customTranslateModule = {
  translate: ["value", customTranslate]
};

var bpmnModeler = new BpmnModeler({
  container: "#js-canvas",
  propertiesPanel: {
    parent: '#js-properties-panel'
  },
  additionalModules: [
    customTranslateModule,
    camundaModdleExtension,
    BpmnPropertiesPanelModule,
    BpmnPropertiesProviderModule,
    CamundaPlatformPropertiesProviderModule,
    ElementTemplatesPropertiesProviderModule
  ],
  moddleExtensions: {
    camunda: camundaModdlePackage
  }
});

async function bpmn() {
  try {
    const { warnings } = await bpmnModeler.importXML(diagramXML)
    bpmnModeler.get("canvas").zoom("fit-viewport");
    // console.log(warnings);
  } catch (err) {
    console.log(err)
  }
}

const btn = document.getElementById('js-download-diagram');
btn.addEventListener('click', async () => {
  const { xml, definitions } = await bpmnModeler.saveXML({ format: true });
  // var definitions = bpmnModeler.get('canvas').getRootElement().businessObject.$parent;
  const { rootElements: root, diagrams } = definitions;

  console.log({
    root,
    diagrams
  })
  console.log(xml)
})

bpmn()
