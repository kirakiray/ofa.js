export const fileData = {
  name: "root",
  type: "dir",
  children: [
    {
      name: "src",
      type: "dir",
      children: [
        {
          name: "components",
          type: "dir",
          children: [],
        },
        {
          name: "utils",
          type: "dir",
          children: [],
        },
        {
          name: "index.js",
          type: "file",
          content: "// Main entry point\nconsole.log('Hello World');",
        },
      ],
    },
    {
      name: "docs",
      type: "dir",
      children: [
        {
          name: "README.md",
          type: "file",
          content: "# Documentation\n\nThis is a sample documentation file.",
        },
        {
          name: "CHANGELOG.md",
          type: "file",
          content: "# Changelog\n\n## v1.0.0\n- Initial release",
        },
      ],
    },
    {
      name: "config.json",
      type: "file",
      content: '{\n  "name": "my-project",\n  "version": "1.0.0"\n}',
    },
    {
      name: "package.json",
      type: "file",
      content:
        '{\n  "name": "example-project",\n  "scripts": {\n    "dev": "node dev.js"\n  }\n}',
    },
    {
      name: "README.md",
      type: "file",
      content: "# My Project\n\nA sample project for ofa.js demo.",
    },
  ],
};
