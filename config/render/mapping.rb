polygons :places do
  map :place => [:city, :town, :village]
end

lines :roads do
  with :ref => :string

  map :highway, :man_made => :cutline
end

lines :rails do
  map :railway
end

polygons :squares do
  map :highway
end

lines :waterways do
  map :waterway => [:stream, :river, :canal, :drain, :ditch], :barrier => :ditch
end

polygons :waterareas do
  map :waterway => [:riverbank, :drain, :pond], :natural => [:water, :lake, :bay], :landuse => [:basin, :reservoir]
end

lines :barriers, :boundaries => true do
  map :barrier, :natural => :cliff, :man_made => :enbankment
end

lines :powerlines, :boundaries => true do
  map :power => :line
end

points :powerpoints, :boundaries => true do
  map :power => [:tower, :pole]
end

polygons :territories do
  map :landuse, :natural => [:wood, :scrub, :wetland, :beach]
end

polygons :buildings do
  with :address

  map :building, :power => :generator, :man_made => [:water_tower, :reservoir_covered, :tank, :water_tank, :water_works, :wastewater_plant, :tower, :communications_tower, :monitoring_station]
end

polygons :areas do
  with :address

  map :leisure, :amenity, :tourism, :shop, :office, :sport, :man_made => [:well, :water_well, :artesian_well], :historic => [:monument, :memorial, :ruins], :landuse => [:cemetery], :natural => [:spring], :multi => true
end
