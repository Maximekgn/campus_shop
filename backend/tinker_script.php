<?php
$reportedIds = \App\Models\Report::pluck('listing_id')->toArray();
\App\Models\Favorite::whereNotIn('listing_id', $reportedIds)->delete();
\App\Models\Message::whereNotIn('conversation_id', \App\Models\Conversation::whereIn('listing_id', $reportedIds)->pluck('id')->toArray())->delete();
\App\Models\Conversation::whereNotIn('listing_id', $reportedIds)->delete();
\App\Models\ListingPhoto::whereNotIn('listing_id', $reportedIds)->delete();
\App\Models\Listing::whereNotIn('id', $reportedIds)->delete();
echo "Base de données nettoyée avec succès.\n";
echo "Utilisateurs conservés: " . \App\Models\User::count() . "\n";
echo "Annonces restantes (signalées) : " . \App\Models\Listing::count() . "\n";
?>
