import { useEffect, useCallback } from 'react';
import { useLocation, matchPath, useNavigate } from 'react-router-dom';
import { Buffer } from 'buffer';
import ReactGA from 'react-ga4';

export function useUrlSync(skillPlanner) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  // Load build from URL on mount/path change
  useEffect(() => {
    // Handle redirect for root paths
    if (currentPath === '/planner' || currentPath === '/planner#') {
      window.location.pathname = '/planner/';
      return;
    }

    // If there's no URL path, don't override localStorage autosave
    if (!currentPath || currentPath === '/') return;

    ReactGA.event({
      category: 'Builds',
      action: 'Load Path',
      label: currentPath
    });

    const match = matchPath('/:encoded', currentPath);
    if (!match) return;

    try {
      const sha = match.params.encoded;
      const unpackedString = Buffer.from(sha, 'base64').toString('ascii');
      const parsed = JSON.parse(unpackedString);

      if (parsed?.jobId && parsed?.skillLevels) {
        // URL build takes precedence over localStorage
        skillPlanner.loadBuild(parsed.jobId, parsed.skillLevels);
        skillPlanner.setCopySuccess('Imported!');
        
        setTimeout(() => {
          skillPlanner.setCopySuccess('');
        }, 2000);

        ReactGA.event({
          category: 'Builds',
          action: 'Load',
          label: 'Success',
          value: parsed.jobId
        });
      }
    } catch (error) {
      console.error('Failed to parse build from URL:', error);
      navigate('/', { replace: true });
      
      ReactGA.event({
        category: 'Builds',
        action: 'Load',
        label: 'Failure'
      });
    }
  }, [currentPath]); // Only depend on path changes

  // Save build to URL
  const saveBuild = useCallback(async () => {
    ReactGA.event({
      category: 'Builds',
      action: 'Save',
      label: 'Attempted'
    });

    // Clean up skill levels (remove zeros)
    const skillLevelsClean = Object.fromEntries(
      Object.entries(skillPlanner.skillLevels).filter(([_, value]) => value !== 0)
    );

    const packed = JSON.stringify({
      jobId: skillPlanner.jobId,
      skillLevels: skillLevelsClean
    });

    const base64String = Buffer.from(packed).toString('base64');

    if (base64String) {
      navigate(`/${base64String}`, { replace: true });

      try {
        await navigator.clipboard.writeText(window.location.href);
        skillPlanner.setCopySuccess('URL Copied!');
        
        setTimeout(() => {
          skillPlanner.setCopySuccess('');
        }, 2000);

        ReactGA.event({
          category: 'Builds',
          action: 'Save',
          label: 'Success',
          value: skillPlanner.jobId
        });
      } catch (err) {
        skillPlanner.setCopySuccess('Failed to copy URL');
        console.error('Failed to copy to clipboard:', err);
      }
    }
  }, [skillPlanner.jobId, skillPlanner.skillLevels, navigate]);

  return { saveBuild };
}
