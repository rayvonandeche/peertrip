import React from 'react';

const AIAssistantFab = ({ aiAssistant }) => {
  return (
    <a href={aiAssistant.href} className="ai-assistant-fab" title={aiAssistant.title}>
      <i className={aiAssistant.icon}></i>
    </a>
  );
};

export default AIAssistantFab;
