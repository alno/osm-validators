#!/usr/bin/env rake

$:.unshift('.')

namespace :db do

  desc "Migrate database schema"
  task :migrate do
    require 'lib/database'

    exec "bundle exec sequel -m db/migrate '#{DB_CONN_STRING}'"
  end

end

namespace :render do

  task :download do
    if ENV['FILE'] # Dump is present, just import it
      dump_file = File.expand_path(ENV['FILE'])
    else # Dump should be downloaded
      importdir = File.expand_path('tmp/import', File.dirname(__FILE__))

      FileUtils.rm_rf importdir
      FileUtils.mkdir_p importdir

      dump_url = "http://data.gis-lab.info/osm_dump/dump/latest/RU.osm.pbf"
      dump_file = "#{importdir}/#{dump_url.split('/').last}"

      puts "Downloading OSM dump..."
      system "cd '#{importdir}' && wget '#{dump_url}'" or raise StandardError.new("Error downloading dump from '#{dump_url}'")
    end

    require 'lib/database'

    binary = File.expand_path('vendor/bin/osm2pgsql', File.dirname(__FILE__))
    style = File.expand_path('config/render/osm2pgsql.style', File.dirname(__FILE__))

    ENV['PGPASS'] = DB_CONFIG['password']
    system "cd '#{importdir}' && '#{binary}' -j -m --slim -S #{style} -U #{DB_CONFIG['username']} -d #{DB_CONFIG['database']} -H #{DB_CONFIG['host']} -p raw '#{dump_file}'" or raise StandardError.new("Error importing data")
  end

  task :update_views do
    require 'lib/database'
    require 'osm_import'

    OsmImport.import File.expand_path('config/render/mapping.rb', File.dirname(__FILE__)), :pg => { :dbname => DB_CONFIG['database'], :user => DB_CONFIG['username'], :password => DB_CONFIG['password'], :host => DB_CONFIG['host'] }, :projection => '900913', :prefix => 'render_', :raw_prefix => 'raw_', :target => 'pg_views'
  end

end

namespace :validators do

  namespace :poi do

    desc "Import data in POI validator"
    task :update do
      require 'lib/database'
      require 'lib/validators/poi'

      start = Time.now
      Validators::Poi.validate!

      DB[:map_errors].where('source = ? AND updated_at < ?', 'poi', start).update :deleted_at => Time.now
    end

  end

  namespace :zkir do

    desc "Import data of Zkir validator"
    task :import do
      require 'open-uri'
      require 'lib/database'
      require 'lib/importers/zkir'

      if ENV['FILE']
        Importers::Zkir.import_from! File.open(ENV['FILE'])
      elsif ENV['URL']
        Importers::Zkir.import_from! open(ENV['URL'])
      else
        puts "You should specify an input file!"
      end
    end

    desc "Update all data of Zkir validator"
    task :update do
      require 'open-uri'
      require 'lib/database'
      require 'lib/importers/zkir'

      start = Time.now
      regions = ["RU-ALT", "RU-AMU", "RU-ARK", "RU-AST", "RU-BA", "RU-BEL", "RU-BRY", "RU-BU", "RU-VLA", "RU-VGG", "RU-VLG", "RU-VOR", "RU-DA", "RU-YEV", "RU-SVE", "RU-ZAB", "RU-IVA", "RU-IN", "RU-IRK", "RU-KB", "RU-KGD", "RU-KL", "RU-KLU", "RU-KAM", "RU-KC", "RU-KR", "RU-KEM", "RU-KIR", "RU-KO", "RU-KOS", "RU-KDA", "RU-KYA", "RU-KGN", "RU-KRS", "RU-LIP", "RU-MAG", "RU-ME", "RU-MO", "RU-MOS", "RU-MUR", "RU-NEN", "RU-NIZ", "RU-NGR", "RU-NVS", "RU-OMS", "RU-ORE", "RU-ORL", "RU-PNZ", "RU-PER", "RU-PRI", "RU-PSK", "RU-AL", "RU-ROS", "RU-RYA", "RU-SAM", "RU-SPO", "RU-SAR", "RU-SAK", "RU-SE", "RU-SMO", "RU-STA", "RU-TAM", "RU-TA", "RU-TVE", "RU-TOM", "RU-TY", "RU-TUL", "RU-TYU", "RU-UD", "RU-ULY", "RU-KHA", "RU-KK", "RU-KHM", "RU-CHE", "RU-CE", "RU-CU", "RU-CHU", "RU-SA", "RU-YAN", "RU-YAR"]
      regions = ENV['REGIONS'].split(',') if ENV['REGIONS']

      regions.each do |reg|
        uri = "http://peirce.gis-lab.info/ADDR_CHK/#{reg}.mp_addr.xml"

        puts "Importing errors from '#{uri}'..."
        Importers::Zkir.import_from! open(uri)
      end

      DB[:map_errors].where('source = ? AND updated_at < ?', 'zkir', start).update :deleted_at => Time.now
    end

  end

  namespace :cupivan_places do

    task :import do
      require 'lib/database'
      require 'lib/importers/json'

      Importers::Json.import! :cupivan_places, File.open(ENV['FILE'])
    end

    task :update do
      require 'open-uri'
      require 'lib/database'
      require 'lib/importers/json'

      meta = Oj.load(open "http://osm.cupivan.ru/places/validator/validator.json")

      meta['include'].each do |uri|
        puts "Importing errors from '#{uri}'..."
        Importers::Json.import! :cupivan_places, open(uri)
      end
    end

  end

end
