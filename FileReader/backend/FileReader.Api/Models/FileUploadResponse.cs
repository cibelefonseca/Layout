using FileReader.Front.Models;
using System.Collections.Generic;

namespace FileReader.Api.Models
{
    public class FileUploadResponse
    {
        public FileUploadResponse(List<Detection> detections, List<TimeBar> timeBars, VideoInformation videoInformation)
        {
            Detections = detections;
            TimeBars = timeBars;
            VideoInformation = videoInformation;
        }

        public List<Detection> Detections { get; private set; }
        public List<TimeBar> TimeBars { get; private set; }
        public VideoInformation VideoInformation { get; private set; }
    }
}
