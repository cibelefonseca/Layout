import os
import cv2

def handleInitFile():
  if os.path.isdir(dirPathName): 
    try:
      os.rmdir(dirPathName)
      print("File deleted !")  

    except OSError as e:
      print(f"Error:{ e.strerror}")
  else:
    os.mkdir(dirPathName)
    print("File created!") 

dirPathName = 'frames'
handleInitFile()
vidcap = cv2.VideoCapture('SampleVideo_720x480_2mb.mp4')
count = 0
while True:
    success,image = vidcap.read()
    if not success:
        break
    cv2.imwrite(os.path.join(dirPathName,"frame{:d}.png".format(count)), image)     # save frame as JPEG file
    count += 1
print("{} images are extacted in {}.".format(count,dirPathName))

