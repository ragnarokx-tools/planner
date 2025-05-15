import './Skill.css';

function Skill({ data: skillData, skillState, updateSkill }) {

  if (!skillData) {
    return <div>no data found for skill</div>
  }

  const skillName = skillData.name
  const currentValue = skillState[skillName] ? Math.max(skillState[skillName], 0) : 0
  let increase, decrease;

  const handleClick = (value) => {
    return () => {
      if (!currentValue) {
        updateSkill(Math.max(value, 0))
      } else {
        updateSkill(Math.max(currentValue + value, 0))
      }
    }
  }

  const satisfiesRequirements = () => {
    if (skillData.requires) {
      const {name, level} = skillData.requires
      return (skillState[name] && skillState[name] >= level)
    } else {
        return true
    }
  }

  if (currentValue < skillData.max && satisfiesRequirements()) {
    increase = <button onClick={handleClick(1)}>+</button>
  } else {
    increase = <button disabled={true}>+</button>
  }

  if (currentValue === 0) {
    decrease = <button disabled={true}>-</button>
  } else {
    decrease = <button onClick={handleClick(-1)}>-</button>
  }

  return (
    <div className="Skill">
        <div className="Skill-icon">{skillData.name}</div>
        <div className="Skill-details">
            <div className="Skill-name">{skillData.name}</div>
            <div className="Skill-modifiers">
                {increase}
                <div className="Skill-value">{currentValue}/{skillData.max}</div>
                {decrease}
            </div>
        </div>
    </div>
  );
}

export default Skill;