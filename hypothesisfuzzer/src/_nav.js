import example from "./example3.json";


var repoNum = 0;
const repos = example.repositories;
const repolist = [];

repos.map(() =>{
  repolist.push(
    {
      name: 'Repo ' + repoNum,
      url: `/dashboard/${repoNum}`,
      icon: 'icon-check',
    }
  );
  repoNum++;
});


export default {
  items: [
    {
      name: 'Dashboard',
      url: '#',
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
