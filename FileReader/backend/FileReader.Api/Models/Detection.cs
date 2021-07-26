using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FileReader.Front.Models
{
    public class Detection
    {
        public string label { get; set; }
        public IList<Trajectory> trajectories { get; set; }
    }

    public class Trajectory
    {
        public int frame { get; set; }
        public float cx { get; set; }
        public float cy { get; set; }
        public float dx { get; set; }
        public float dy { get; set; }
    }
}
