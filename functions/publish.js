const octokit = require('@octokit/rest')();

exports.handler = async function (event, context) {
  console.log('GOT IT', event);

  let md = '';
  if (event.isBase64Encoded) {
    md = Buffer.from(event.body, 'base64').toString('utf8');
  } else {
    md = event.body;
  }

  const title = md.match(/# (.*)/)[1];
  const slug = title.toLowerCase().replace(/ /g, '-');
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() < 11 ? '0' : '') + (now.getMonth() + 1);
  const day = (now.getDate() < 10 ? '0' : '') + now.getDate();
  const date = `${year}-${month}-${day}`;

  const tags = event.headers['tags']
    .split(/, ?/)
    .map(v => `"${v}"`)
    .join(', ');

  const fm = [
    '---',
    `title: "${title}"`,
    `slug: "${slug}"`,
    `date: "${date}"`,
    `url: "blog/${year}/${month}/${day}/${slug}.html"`,
    `tags: [ ${tags} ]`,
    '---'
  ].join('\n');

  md = fm + '\n\n' + md.replace(/# (.*)/, '');

  octokit.authenticate({
    type: 'basic',
    username: event.headers['gh_user'],
    password: event.headers['gh_pass']
  });

  const result = await octokit.repos.createFile({
    owner: 'ramiro-ruiz',
    repo: 'ramiroruiz.com',
    path: `content/blog/${year}/${month}/${slug}.md`,
    message: `Publish ${slug}.md`,
    content: Buffer.from(md, 'utf8').toString('base64'),
    branch: 'version-2'
  });

  return {
    statusCode: 200,
    body: md
  };
};
