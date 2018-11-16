import example from "./example2.json";

var repoNum = 0;
const repos = example.repo1;
const repolist = [];
repos.map(() =>{
  repolist.push(
    {
      name: 'Repo' + repoNum,
      url: `/dashboard/${repoNum}`,
      icon: 'icon-check',
    }
  );
  repoNum++;
});

console.log(repolist);

export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard/',
      icon: 'icon-speedometer',
      badge: {
        variant: 'info',
        text: 'NEW',
      },
    },
    {
      title: true,
      name: 'Repositories',
    },
  ].concat(repolist),
};
