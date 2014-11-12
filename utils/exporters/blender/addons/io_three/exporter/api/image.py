import os
from bpy import data, types
from .. import logger


def _image(func):

    def inner(name, *args, **kwargs):

        if isinstance(name, types.Image):
            mesh = name
        else:
            mesh = data.images[name] 

        return func(mesh, *args, **kwargs)

    return inner


def file_name(image):
    logger.debug('image.file_name(%s)', image)
    return os.path.basename(file_path(image)) 


@_image
def file_path(image):
    logger.debug('image.file_path(%s)', image)
    return os.path.normpath(image.filepath_from_user())
