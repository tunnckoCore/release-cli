import path from 'path';
import proc from 'process';
import gitCommitsSince from 'git-commits-since';
import detector from 'detect-next-version';

export default async function release(options) {
  const opts = Object.assign({ cwd: proc.cwd() }, options);

  // TODO: in next major
  if (opts.monorepo) {
    return [];
  }

  const { default: pkg } = await import(path.join(opts.cwd, 'package.json'));

  // ? intentionally remove the `opts.plugin` from options passed to `git-commits-since`
  const { plugin, ...opt } = opts;

  const { rawCommits } = await gitCommitsSince(opt);

  if (rawCommits.length === 0) {
    console.log('No (new) commits since last(est) tag');
    proc.exit(0);
    return null;
  }

  return detector(rawCommits, Object.assign({}, opt, { name: pkg.name }));
}
