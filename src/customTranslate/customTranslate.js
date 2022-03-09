import es from './es';

export default function customTranslate(template, replacements) {
  replacements = replacements || {};

  // Translate
  template = es[template] || template;

  // Replace
  return template.replace(/{([^}]+)}/g, function(_, key) {
    return replacements[key] || '{' + key + '}';
  });
}