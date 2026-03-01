import Skill from "../skill/Skill.js"
import "./job.css"

const SKILL_TREE_TYPES = {
  SPACER: 0,
  SPACER_HR: -1,
  CONNECTOR: -2,
  CONNECTOR_HR: -3
};

const COLUMNS_COUNT = 3;

function Job({data: jobData, skillLevels, setSkillLevel}) {

  const {name, skillTree, skills} = jobData

  const handleSkillUpdate = (skillId, max) => (newValue) => {
    setSkillLevel(skillId, newValue, max);
  };

  const renderSkillsInTree = () => {
    if (!skills || !skillTree) {
      return <div>couldn't find skills</div>;
    }

    const highlightColumns = Array(COLUMNS_COUNT).fill(false);
    let currentColumn = 0;

    const renderSpacer = (type, index) => {
      const isConnector = type === SKILL_TREE_TYPES.CONNECTOR || type === SKILL_TREE_TYPES.CONNECTOR_HR;
      const hasHr = type === SKILL_TREE_TYPES.SPACER_HR || type === SKILL_TREE_TYPES.CONNECTOR_HR;
      const baseClass = isConnector ? 'Job-connector' : 'Job-spacer';
      const className = `${baseClass} ${highlightColumns[currentColumn] ? 'is-met' : ''}`;
      const key = `${baseClass}-${hasHr ? 'hr-' : ''}${index}`;
      
      currentColumn = (currentColumn + 1) % COLUMNS_COUNT;
      
      return <div key={key} className={className}>{hasHr && <hr />}</div>;
    };

    const skillTreeItems = skillTree.map((skillId, index) => {
      if (skillId > 0) {
        const currentLevel = skillLevels[skillId] || 0;
        const skillObject = skills[skillId];
        const nextSkill = skillObject.nextId && skills[skillObject.nextId];
        const prevSkill = skillObject.prevId && skills[skillObject.prevId];
        
        const meetsNextPrereq = nextSkill && currentLevel >= skillObject.nextLevel;
        
        const skillElement = (
          <Skill
            key={skillId}
            name={skillObject.name}
            max={skillObject.max}
            currentLevel={currentLevel}
            nextId={nextSkill ? skillObject.nextId : null}
            nextLevel={nextSkill ? skillObject.nextLevel : null}
            nextLevelCurrent={nextSkill ? skillLevels[skillObject.nextId] : null}
            prevId={prevSkill ? skillObject.prevId : null} 
            prevLevel={prevSkill ? skillObject.prevLevel : null}
            prevLevelCurrent={prevSkill ? skillLevels[skillObject.prevId] : null}
            spriteIndex={skillObject.spriteIndex}
            updateSkill={handleSkillUpdate(skillId, skillObject.max)}
          />
        );
        
        highlightColumns[currentColumn] = meetsNextPrereq;
        currentColumn = (currentColumn + 1) % COLUMNS_COUNT;
        
        return skillElement;
      }
      
      return renderSpacer(skillId, index);
    });
    
    return <div className="Job-skillGrid">{skillTreeItems}</div>;
  }; 

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