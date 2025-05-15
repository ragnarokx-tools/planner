import './Skill.css';

function Skill({ data: skillData, skillState, updateSkill }) {

  if (!skillData) {
    return <div>no data found for skill</div>
  }

  const skillName = skillData.name
  const currentValue = skillState[skillName] ? Math.max(skillState[skillName], 0) : 0
  let increase;

  const handleClick = (value) => {
    return () => {
      if (!currentValue) {
        updateSkill(Math.max(value, 0))
      } else {
        updateSkill(Math.max(currentValue + value, 0))
      }
    }
  }

  const hasPrereqs = () => {
    return true
  }

  if (currentValue < skillData.max && hasPrereqs()) {
    increase = <b onClick={handleClick(1)}>+</b>
  } else {
    increase = <b>x</b>
  }


  return (
    <div className="Skill">
        <div className="Skill-icon">icon</div>
        <div className="Skill-name">{skillData.name}</div>
        <div className="Skill-modifiers">
            {increase}
            <b>{currentValue}</b>
            <b onClick={handleClick(-1)}>-</b>
        </div>
    </div>
  );
}

export default Skill;