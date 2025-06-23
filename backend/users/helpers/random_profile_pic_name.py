import uuid
import os

def profile_pic_upload_to(instance, filename):
    ext = filename.split('.')[-1]
    # Generate unique filename with same extension
    filename = f"{uuid.uuid4()}.{ext}"
    return os.path.join("profile_pics", filename)
