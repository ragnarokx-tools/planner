import Skill from "../skill/Skill.js"
import "./job.css"

function Job({data: jobData, skillLevels, setSkillLevel}) {

  const {name, skillTree, skills} = jobData

  const handleSkillUpdate = (skillId, max) => (newValue) => {
    setSkillLevel(skillId, newValue, max);
  };

  const renderSkillsInTree = () => {
    if (!skills || !skillTree) {
      return <div>couldn't find skills</div>;
    }

    const skillTreeItems = skillTree.map((skillId, index) => {
      if (skillId > 0) {
        const currentLevel = skillLevels[skillId] || 0;
        const skillObject = skills[skillId];
        const nextSkillExists = skillObject.nextId ? skills[skillObject.nextId] : null;
        const prevSkillExists = skillObject.prevId ? skills[skillObject.prevId] : null;
        
        return (
          <Skill
            key={skillId}
            name={skillObject.name}
            max={skillObject.max}
            currentLevel={currentLevel}
            nextId={nextSkillExists ? skillObject.nextId : null}
            nextLevel={nextSkillExists ? skillObject.nextLevel : null}
            nextLevelCurrent={nextSkillExists ? skillLevels[skillObject.nextId] : null}
            prevId={prevSkillExists ? skillObject.prevId : null} 
            prevLevel={prevSkillExists ? skillObject.prevLevel : null}
            prevLevelCurrent={prevSkillExists ? skillLevels[skillObject.prevId] : null}
            spriteIndex={skillObject.spriteIndex}
            updateSkill={handleSkillUpdate(skillId, skillObject.max)}
          />
        );
      } else if (skillId === -2) {
        return <div key={`connector-${index}`} className="Job-connector" />;
      } else if (skillId === -3) {
        return <div key={`connector-hr-${index}`} className="Job-connector"><hr /></div>;
      } else if (skillId === -1) {
        return <div key={`spacer-hr-${index}`} className="Job-spacer"><hr /></div>;
      } else {
        return <div key={`spacer-${index}`} className="Job-spacer" />;
      }
    });
    
    return <div className="Job-skillGrid">{skillTreeItems}</div>;
  }; 

  if (!skills) {
    return <div>no data for {name}</div>;
  }

  return (
    <div className="Job">
      <div className="Job-header">
        <div className="Job-title">{name}</div>
      </div>
      {renderSkillsInTree()}
    </div>
  );
}

export default Job;