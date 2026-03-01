import { useState } from 'react';
import SkillSprite from "../skillsprite/SkillSprite";
import "./SkillSummary.css"

function SkillSummary({ skillLevels, skills, onSaveBuild, totalSkillPoints, jobName }) {
  const [showSummary, setShowSummary] = useState(false);
  const [copyButtonText, setCopyButtonText] = useState("copy build link");
    
  const onToggleSummary = () => {
    setShowSummary(!showSummary);
    // Reset button text when closing
    if (showSummary) {
      setCopyButtonText("copy build link");
    }
  };

  const handleCopyLink = () => {
    onSaveBuild();
    setCopyButtonText("copied build link!");
    setTimeout(() => {
      setCopyButtonText("copy build link");
    }, 2000);
  };

  const summary = Object.entries(skillLevels)
    .filter(([_, level]) => level > 0)
    .map(([skillId, level]) => {
      const skill = skills[skillId];
      if (!skill) return null;

      const { name, max, spriteIndex } = skill;
      return (
        <div key={skillId} className="SkillSummary-itemLine">
          <div className="SkillSummary-miniIcon">
            <SkillSprite spriteIndex={spriteIndex} />
          </div>
          <div className="SkillSummary-levelValue">
            {name}: {level}/{max}
          </div>
        </div>
      );
    });

  const buttonText = showSummary ? "hide summary" : "show summary";
  const hasSkills = summary.length > 0;

  if (!hasSkills) {
    return null;
  }

  return (
    <>
      <button className="SkillSummary-toggleButton" onClick={onToggleSummary}>
        {buttonText}
      </button>
      {showSummary && (
        <div className="SkillSummary-overlay" onClick={onToggleSummary}>
          <div className="SkillSummary-modal" onClick={(e) => e.stopPropagation()}>
            <div className="SkillSummary-header">
              <h3>{jobName}</h3>
              <div className="SkillSummary-totalPoints">
                {totalSkillPoints}/170
              </div>
              <button className="SkillSummary-close" onClick={onToggleSummary}>×</button>
            </div>
            <div className="SkillSummary-list">{summary}</div>
            <div className="SkillSummary-footer">
              <button className="SkillSummary-copyButton" onClick={handleCopyLink}>
                {copyButtonText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SkillSummary;