
class DBHelper():
    
    def importData(self, albums, startIndex=0):
        """Takes a list of locations, a start index, geocodes the locations adds to DB"""
        
        locationList = [x['gphoto$location']['$t'] for x in albums]
        print locationList
        
        """for each album in data
                get location and send request to google to geocode location
                save location name, lat, long to Location table
                save name, url & location to Album table
                for each picture in album
                    save picture thumb url, url & album to table"""
        

                
                
                
