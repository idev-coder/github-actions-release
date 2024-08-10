#!/usr/bin/env node
const core = require('@actions/core');
const addr = require('email-addresses');
const {getOctokit, context} = require('@actions/github');
const fs = require('fs');

function publish(config) {
    return new Promise((resolve, reject) => {
        let bodyFileContent = null;
        if ('' !== config.body_path && !!config.body_path) {
            try {
                bodyFileContent = fs.readFileSync(config.body_path, { encoding: 'utf8' });
            } catch (error) {
                core.setFailed(error.message);
            }
        }
        const github = getOctokit(config.github_token);
        github.rest.repos.createRelease({
            owner: config.owner,
            repo: config.repo,
            configtag_name: config.tag,
            name: config.name,
            body: bodyFileContent || config.body,
            draft: config.draft,
            prerelease: config.prerelease,
            target_commitish: config.commitish,
        }).then((res) => {
            resolve(res)
        }).catch(err => {
            reject(err)
        });
    });
}

function main(args) {
    return Promise.resolve().then(() => {
        const options = {
            github_token: core.getInput('github_token') || process.env.GITHUB_TOKEN,
            tag: core.getInput('tag', { required: true }).replace('refs/tags/', ''),
            name: core.getInput('name', { required: false }).replace('refs/tags/', ''),
            body: core.getInput('body', { required: false }),
            body_path: core.getInput('body_path', { required: false }),
            draft: 'true' === core.getInput('draft', { required: false }),
            prerelease: 'true' === core.getInput('prerelease', { required: false }),
            commitish: core.getInput('commitish', { required: false }) || context.sha,
            owner: core.getInput('owner', { required: false }) || context.repo.owner,
            repo: core.getInput('repo', { required: false }),
            user: core.getInput('user', { required: false }),
        }


        let user;
        if (options.user) {
            const parts = addr.parseOneAddress(options.user);
            if (!parts) {
                throw new Error(
                    `Could not parse name and email from user option "${options.user}" ` +
                    '(format should be "Your Name <email@example.com>")'
                );
            }
            user = { name: parts.name, email: parts.address };
        }

        const config = {
            github_token: options.github_token,
            tag: options.tag,
            name: options.name,
            body: options.body,
            body_path: options.body_path,
            draft: options.draft,
            prerelease: options.prerelease,
            commitish: options.commitish,
            owner: options.owner,
            repo: options.repo ? options.repo : `https://git:${options.github_token}@github.com/${context.repo.owner}/${context.repo.repo}.git`,
            silent: !!options.silent,
            user: user ? user : {
                name: `${context.repo.owner}`,
                email: `${context.repo.owner}@users.noreply.github.com`
            }
        };

        return publish(config);
    });
}

main(process.argv)
    .then(() => {
        process.stdout.write('Published\n');
    })
    .catch((err) => {
        process.stderr.write(`${err.stack}\n`, () => process.exit(1));
    });