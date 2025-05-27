import React, { useState } from 'react';
import SkillSprite from "../skillsprite/SkillSprite";
import "./SkillSummary.css"

function SkillSummary({skillLevels, skillsByJob}) {
  const [showSummary, setSummaryVisible] = useState(false);
    
  const onToggleSummary = () => {
    setSummaryVisible(!showSummary)
  }

  let summary;
  try {
    if (skillLevels) {
    //const skillsByJob = getSkillsByJob()
    summary = Object.entries(skillLevels).map(
      ([skillId, skillLevel], _) => {
      if (skillLevel > 0) {
        const foundSkill = skillsByJob[skillId]
        const {name, max, spriteIndex} = foundSkill
        return <div className="SkillSummary-itemLine">
          <div className="SkillSummary-miniIcon">
            <SkillSprite spriteIndex={spriteIndex}/>
          </div>
          <div className="SkillSummary-levelValue">
            {name}: {skillLevel}/{max}
          </div>
        </div>
      } else {
        return null
      }
    })
    }
  } catch {
    console.log("unable to render summary")
  }

  let showHideSummary = showSummary ? "hide summary" : "show summary"
  let maybeStyle = showSummary ? {} : {display: "none"}

  return <div className="SkillSummary">
      <div className="SkillSummary-controls">
      <button onClick={onToggleSummary}>{showHideSummary}</button>
      </div>
      <div className="SkillSummary-list" style={maybeStyle}>{summary}</div>
  </div>
}

export default SkillSummary;