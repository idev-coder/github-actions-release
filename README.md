# Github Actions Create Release

 See also the GitHub official GitHub Pages Action first.

## Example usage

``` yml
name: GitHub Pages

on:
  push:
    branches:
      - main  # Set a branch name to trigger deployment
  pull_request:

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v3
      - name: Github Actions Create Release
        uses: idev-coder/github-actions-release@v1.0.0
        with:
          github_token: ${{secrets.GITHUB_TOKEN}}
          tag: '<tag version>' # 'The name of the tag. This should come from the webhook payload, `github.GITHUB_REF` when a user pushes a new tag'
          name: '<release name>' # The name of the release. For example, `Release v1.0.1`by default.
          body: '<tag>' # Text describing the contents of the tag..
          body_path: '<path file>' #Path to file with information about the tag.
          draft: 'true' # `true` to create a draft (unpublished) release, `false` to create a published one. Default: `false`
          prerelease: 'false' # true` to identify the release as a prerelease. `false` to identify the release as a full release. Default: `false`
          commitish: '<SHA>' # Any branch or commit SHA the Git tag is created from, unused if the Git tag already exists. Default: SHA of current commit
          owner: '<username>' # Owner of the repository if it is not the current one
          repo: 'https://git:${{GITHUB_TOKEN}}@github.com/user/private-repo.git' #URL of the repository you are pushing to
          user: 'username <username@users.noreply.github.com>' # The name and email of the user (defaults to the git config).  Format is "Your Name <email@example.com>".
        env:
          GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}
```