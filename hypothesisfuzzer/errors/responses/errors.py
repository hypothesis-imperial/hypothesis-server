from flask import jsonify


def private_repo_error():
    msg = "Cannot access a private repository." +\
        " Make public, or add SSH keys, and try again."

    return jsonify(error=500, text=str(msg)), 500


def no_code_dir_error():
    msg = "No git repository has been cloned yet." + \
        " Please push code and/or configure your webhooks."

    return jsonify(error=500, text=str(msg)), 500


def generic_error(msg="An error occured on the server!"):
    return jsonify(error=500, text=msg), 500
