import React from 'react';
import {Composition} from 'remotion';
import {Episode, layout, Seg, SceneMap} from './kit';
import {EPISODES} from './registry';

type Mod = {segs: Seg[]; scenes: SceneMap; title: string};
export const Root: React.FC = () => (
  <>
    {Object.entries(EPISODES as Record<string, Mod>).map(([slug, m]) => (
      <Composition key={slug} id={'ep' + slug.replace(/-/g, '')} component={() => <Episode segs={m.segs} scenes={m.scenes} title={m.title} />}
        durationInFrames={layout(m.segs).total} fps={30} width={1080} height={1920} />
    ))}
  </>
);
