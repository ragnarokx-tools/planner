import skillSprites from '../../icons/all_skills_global.png'

const iconSize = 100
const columnSize = 20
const spriteUrl = `url(${skillSprites})`

function SkillSprite ({spriteIndex, isDisabled=false}) {
    // sprite sheet constructed using the following:
    // 20 columns
    // 100px fixed width
    // pre-determined sprite Index (i will be sad later)
    let iconStyle;
    if (spriteIndex >= 0) {
      const offsetX = spriteIndex % columnSize
      const offsetY = Math.floor(spriteIndex / columnSize)
      iconStyle = {
        backgroundImage: spriteUrl,
        backgroundPosition: `-${offsetX*iconSize}px -${offsetY*iconSize}px`,
        width: `${iconSize}px`,
        height: `${iconSize}px`
      };
    }
    
    let filter = "grayscale(100%)"
    if (!isDisabled) {
      filter = ""
    }
    iconStyle["filter"] = filter
    return <div 
      className="SkillSprite"
      style={iconStyle}
    />
}

export default SkillSprite;