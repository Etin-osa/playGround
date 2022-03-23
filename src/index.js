import $ from 'jquery';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule
} from 'bpmn-js-properties-panel';

import qaExtension from './resources/qa.json'

// styles
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import "bpmn-js-properties-panel/dist/assets/element-templates.css";
import "bpmn-js-properties-panel/dist/assets/properties-panel.css";
import './styles/main.scss'
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

const diagramXML = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" id="Definitions_0ex8ya2" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="4.4.0">
  <bpmn:process id="Process_03dsped" isExecutable="true" />
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_03dsped" />
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
`
const qualityAssuranceEl = document.getElementById('quality-assurance'),
      suitabilityScoreEl = document.getElementById('suitability-score'),
      lastCheckedEl = document.getElementById('last-checked'),
      okayEl = document.getElementById('okay'),
      formEl = document.getElementById('form'),
      warningEl = document.getElementById('warning');

const HIGH_PRIORITY = 1500;

var bpmnModeler = new BpmnModeler({
  container: "#js-canvas",
  propertiesPanel: {
    parent: '#js-properties-panel'
  },
  additionalModules: [
    BpmnPropertiesPanelModule,
    BpmnPropertiesProviderModule
  ],
  moddleExtensions: {
    qa: qaExtension
  }
});

async function bpmn() {
  try {
    const { warnings } = await bpmnModeler.importXML(diagramXML)
    const moddle = bpmnModeler.get('moddle')
    const modeling = bpmnModeler.get('modeling');

    let analysisDetails,
        businessObject,
        element,
        suitabilityScore;

    // open quality assurance if user right clicks on element
    bpmnModeler.on('element.contextmenu', HIGH_PRIORITY, (event) => {
      event.originalEvent.preventDefault();
      event.originalEvent.stopPropagation();

      qualityAssuranceEl.classList.remove('hidden');

      ({ element } = event);

      // ignore root element
      if (!element.parent) {
        return;
      }

      businessObject = getBusinessObject(element);

      let { suitable } = businessObject;

      suitabilityScoreEl.value = suitable ? suitable : '';

      suitabilityScoreEl.focus();

      analysisDetails = getExtensionElement(businessObject, 'qa:AnalysisDetails');
      console.log(analysisDetails)
      lastCheckedEl.textContent = analysisDetails ? analysisDetails.lastChecked : '-';

      validate();
    });

    // set suitability core and last checked if user submits
    formEl.addEventListener('submit', (event) => {
      event.preventDefault();
      event.stopPropagation();

      suitabilityScore = Number(suitabilityScoreEl.value);

      if (isNaN(suitabilityScore)) {
        return;
      }

      const extensionElements = businessObject.extensionElements || moddle.create('bpmn:ExtensionElements');

      if (!analysisDetails) {
        analysisDetails = moddle.create('qa:AnalysisDetails');

        extensionElements.get('values').push(analysisDetails);
      }

      analysisDetails.lastChecked = new Date().toISOString();

      modeling.updateProperties(element, {
        extensionElements,
        suitable: suitabilityScore
      });

      qualityAssuranceEl.classList.add('hidden');
    });

    // close quality assurance if user presses escape
    formEl.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        qualityAssuranceEl.classList.add('hidden');
      }
    });

    // validate suitability score if user inputs value
    suitabilityScoreEl.addEventListener('input', validate);

  } catch (err) {
    console.log(err)
  }
}

// validate suitability score
function validate() {
  const { value } = suitabilityScoreEl;

  if (isNaN(value)) {
    warningEl.classList.remove('hidden');
    okayEl.disabled = true;
  } else {
    warningEl.classList.add('hidden');
    okayEl.disabled = false;
  }
}

function getExtensionElement(element, type) {
  if (!element.extensionElements) {
    return;
  }

  return element.extensionElements.values.filter((extensionElement) => {
    return extensionElement.$instanceOf(type);
  })[0];
}

const btn = document.getElementById('js-download-diagram');
btn.addEventListener('click', async () => {
  const { xml } = await bpmnModeler.saveXML({ format: true });
  console.log(xml)
})

bpmn()
