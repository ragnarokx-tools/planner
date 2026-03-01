import { useEffect } from 'react';
import './App.css';
import Job from './components/job/Job.js';
import SkillSummary from './components/skillsummary/SkillSummary.js';
import { useNavigate } from 'react-router-dom';
import ReactGA from "react-ga4";
import GitHubButton from 'react-github-btn';
import { useSkillPlanner } from './hooks/useSkillPlanner';
import { useUrlSync } from './hooks/useUrlSync';
import { useTheme } from './hooks/useTheme';

function App() {
  const navigate = useNavigate();
  const skillPlanner = useSkillPlanner();
  const { saveBuild } = useUrlSync(skillPlanner);
  const { theme, toggleTheme } = useTheme();

  // Initialize Google Analytics
  useEffect(() => {
    // Only initialize in production
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    try {
      setTimeout(() => {
        ReactGA.initialize("G-10CRLLHRXZ");
        ReactGA.send({ hitType: "pageview", page: window.location.pathname });
      }, 4000);
    } catch (err) {
      console.error('Failed to initialize Google Analytics:', err);
    }
  }, []);

  const handleJobChange = (event) => {
    const newJobId = parseInt(event.target.value);
    const hasSkills = Object.keys(skillPlanner.skillLevels).length > 0;
    
    if (hasSkills && !window.confirm("Changing job will reset all skills. Continue?")) {
      return;
    }
    
    skillPlanner.setJob(newJobId);
    navigate('/', { replace: true });
    window.scrollTo({ top: 0, left: 0 });
  };
  
  const handleResetSkills = () => {
    if (window.confirm("Are you sure you want to reset all skills?")) {
      skillPlanner.resetSkills();
      navigate('/', { replace: true });
    }
  };

  const isOverLimit = skillPlanner.totalSkillPoints > 170;

  return (
    <div className="App">
      <div className="App-header">
        <div className="App-jobName">
          <select name="job" value={skillPlanner.jobId} onChange={handleJobChange}>
            {skillPlanner.jobList.map((job) => (
              <option key={job.id} value={job.id}>{job.name}</option>
            ))}
          </select>
        </div>
        
        <div className="App-totalJobPoints">
          {skillPlanner.totalSkillPoints}/170
          {isOverLimit && (
            <div className="App-jobWarning">warning: exceeds possible job levels</div>
          )}
        </div>
        
        <div className="App-jobButtons">
          <button onClick={saveBuild}>save</button>
          <button onClick={handleResetSkills}>reset</button>
        </div>
        
        <div className="App-secondaryButtons">
          <SkillSummary 
            skillLevels={skillPlanner.skillLevels}
            skills={skillPlanner.currentSkills}
            onSaveBuild={saveBuild}
            totalSkillPoints={skillPlanner.totalSkillPoints}
            jobName={skillPlanner.currentJob?.name}
          />
          <button onClick={toggleTheme} title="Toggle theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
        
        {skillPlanner.copySuccess && (
          <div className="App-copiedUrl" style={{ height: "24px" }}>
            {skillPlanner.copySuccess}
          </div>
        )}
      </div>

      <div className="App-jobContent">
        <Job 
          data={skillPlanner.jobWithSkills}
          skillLevels={skillPlanner.skillLevels}
          setSkillLevel={skillPlanner.setSkillLevel}
        />
      </div>

      <div className="App-footer">
        <GitHubButton 
          href="https://github.com/ragnarokx-tools/planner" 
          data-color-scheme="no-preference: light; light: light; dark: dark;" 
          aria-label="Follow @ragnarokx-tools/planner on GitHub"
        >
          Follow @ragnarokx-tools/planner
        </GitHubButton>
        <a href='https://ko-fi.com/H2H51F455H' target='_blank' rel="noreferrer">
          <img 
            height='36' 
            style={{ border: "0px", height: "36px" }} 
            src='https://storage.ko-fi.com/cdn/kofi5.png?v=6' 
            border='0' 
            alt='Buy Me a Coffee at ko-fi.com' 
          />
        </a>
      </div>
    </div>
  );
}

export default App;
